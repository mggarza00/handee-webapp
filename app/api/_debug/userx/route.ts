import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { ok: true, route: "/api/_debug/user", note: "handler mínimo online" },
    { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } }
  );
}
