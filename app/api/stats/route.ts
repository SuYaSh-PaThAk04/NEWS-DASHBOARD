import { NextResponse } from "next/server";
import { getStats } from "../../../lib/mongodb";

export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json({ ok: true, data: stats });
  } catch (err) {
    console.error("❌ [STATS] Error:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
