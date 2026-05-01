import { NextResponse } from "next/server";
import { fetchNewsBySector } from "../../../../../lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sector: string }> },
) {
  try {
    const { sector: sectorParam } = await params;
    const sector = decodeURIComponent(sectorParam);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = await fetchNewsBySector(sector, page, limit);
    return NextResponse.json({
      ok: true,
      sector,
      ...result,
    });
  } catch (err) {
    console.error("❌ [SECTOR] Error:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
