import { NextRequest, NextResponse } from "next/server";

/**
 * Redirect proxy — wraps Supabase auth links under our own domain.
 * Gmail silently drops emails with long third-party auth URLs (supabase.co).
 * Using /api/ir?to=<url> makes the visible link jorgelorenzo.coach which Gmail trusts.
 */
export async function GET(req: NextRequest) {
  const to = req.nextUrl.searchParams.get("to");

  // Only allow redirects to our Supabase project
  const ALLOWED_HOST = "otsbpiukzftacmvmkajy.supabase.co";

  if (!to) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const dest = new URL(to);
    if (dest.hostname !== ALLOWED_HOST) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.redirect(dest.toString());
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
