import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";

export async function POST(req: NextRequest) {
  const { admin } = await requireAdmin();
  const { email, nombre, apellido, password } = await req.json();

  if (!email || !nombre || !password) {
    return NextResponse.json({ error: "Email, nombre y contraseña son obligatorios" }, { status: 400 });
  }

  const { data, error } = await admin.auth.admin.createUser({
    email: email.trim(),
    password,
    email_confirm: true,
    user_metadata: { nombre: nombre.trim(), apellido: apellido?.trim() ?? "" },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Crear fila en usuarios
  await admin.from("usuarios").upsert({
    id: data.user.id,
    email: email.trim(),
    nombre: nombre.trim(),
    apellido: apellido?.trim() ?? "",
    is_admin: false,
  });

  return NextResponse.json({ ok: true, userId: data.user.id });
}

export async function DELETE(req: NextRequest) {
  const { admin } = await requireAdmin();
  const { userId } = await req.json();

  if (!userId) return NextResponse.json({ error: "userId requerido" }, { status: 400 });

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
