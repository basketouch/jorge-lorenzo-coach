import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const admin = createAdminClient();
  const { data } = await admin.from("usuarios").select("is_admin").eq("id", user.id).single();
  return !!data?.is_admin;
}

interface BunnyVideo {
  guid: string;
  title: string;
  length: number;
  status: number;
}

interface BunnyCollection {
  guid: string;
  name: string;
}

export async function GET(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const apiKey = process.env.BUNNY_STREAM_API_KEY;
  const libraryId = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID;
  if (!apiKey || !libraryId) {
    return NextResponse.json({ error: "Falta configurar BUNNY_STREAM_API_KEY o NEXT_PUBLIC_BUNNY_LIBRARY_ID" }, { status: 500 });
  }

  const headers = { AccessKey: apiKey, Accept: "application/json" };
  const collectionName = req.nextUrl.searchParams.get("collection")?.trim();

  let collectionId: string | undefined;
  if (collectionName) {
    const colRes = await fetch(
      `https://video.bunnycdn.com/library/${libraryId}/collections?search=${encodeURIComponent(collectionName)}&itemsPerPage=100`,
      { headers }
    );
    if (!colRes.ok) {
      return NextResponse.json({ error: `Error consultando colecciones de Bunny (${colRes.status})` }, { status: 502 });
    }
    const colData = await colRes.json();
    const match = (colData.items as BunnyCollection[] | undefined)?.find(
      (c) => c.name.toLowerCase() === collectionName.toLowerCase()
    ) ?? (colData.items as BunnyCollection[] | undefined)?.[0];
    collectionId = match?.guid;
  }

  const videos: BunnyVideo[] = [];
  let page = 1;
  const itemsPerPage = 100;
  while (page <= 20) {
    const url = new URL(`https://video.bunnycdn.com/library/${libraryId}/videos`);
    url.searchParams.set("page", String(page));
    url.searchParams.set("itemsPerPage", String(itemsPerPage));
    url.searchParams.set("orderBy", "date");
    if (collectionId) url.searchParams.set("collection", collectionId);

    const res = await fetch(url, { headers });
    if (!res.ok) {
      return NextResponse.json({ error: `Error consultando vídeos de Bunny (${res.status})` }, { status: 502 });
    }
    const data = await res.json();
    const items: BunnyVideo[] = data.items ?? [];
    videos.push(...items);

    if (items.length < itemsPerPage || videos.length >= (data.totalItems ?? 0)) break;
    page++;
  }

  return NextResponse.json({
    ok: true,
    videos: videos.map((v) => ({ id: v.guid, titulo: v.title, duracionSeg: v.length, status: v.status })),
  });
}
