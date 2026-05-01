import { NextResponse } from "next/server";
import { searchNews } from "../../../../lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!q || q.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Search term must be at least 2 characters" },
        { status: 400 },
      );
    }

    const result = await searchNews(q, page, limit);
    return NextResponse.json({ ok: true, query: q, ...result });
  } catch (err) {
    console.error("❌ [SEARCH] Error:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
