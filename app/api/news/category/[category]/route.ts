import { NextResponse } from "next/server";
import { fetchNewsByCategory } from "../../../../../lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> },
) {
  try {
    const { category } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = await fetchNewsByCategory(category, page, limit);
    return NextResponse.json({
      ok: true,
      category,
      ...result,
    });
  } catch (err) {
    console.error("❌ [CATEGORY] Error:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
