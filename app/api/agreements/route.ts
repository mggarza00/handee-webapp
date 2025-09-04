import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseServer } from "@/lib/_supabase-server";

const BodySchema = z.object({
  request_id: z.string().uuid(),
  professional_id: z.string().uuid(),
  amount: z.number().positive().optional(),
});

const JSONH = { "Content-Type": "application/json; charset=utf-8" } as const;

export async function POST(req: Request) {
  try {
    const ct = (req.headers.get("content-type") || "").toLowerCase();
    if (!ct.includes("application/json")) {
      return NextResponse.json({ ok: false, error: "UNSUPPORTED_MEDIA_TYPE" }, { status: 415, headers: JSONH });
    }

    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "VALIDATION_ERROR", detail: parsed.error.issues.map(i => i.message) },
        { status: 400, headers: JSONH },
      );
    }

    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("agreements")
      .insert({
        request_id: parsed.data.request_id,
        professional_id: parsed.data.professional_id,
        amount: parsed.data.amount ?? null,
      })
      .select("id, status, created_at")
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: "DB_ERROR", detail: error.message }, { status: 500, headers: JSONH });
    }

    return NextResponse.json({ ok: true, data }, { status: 201, headers: JSONH });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "UNKNOWN";
    const status = (err as { status?: number })?.status ?? 500;
    return NextResponse.json({ ok: false, error: "INTERNAL_ERROR", detail: msg }, { status, headers: JSONH });
  }
}
