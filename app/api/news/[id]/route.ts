import { NextResponse } from "next/server";
import { fetchNewsById } from "@/lib/mongodb";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const news = await fetchNewsById(id);

    if (!news) {
      return NextResponse.json(
        { ok: false, error: "News not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, data: news });
  } catch (err) {
    console.error("❌ [DETAIL] Error:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
