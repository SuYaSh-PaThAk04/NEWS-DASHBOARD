import { NextResponse } from "next/server";
import { fetchNews } from "../../../lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    console.log(`📰 [API] Fetching news... page=${page}, limit=${limit}`);
    const result = await fetchNews(page, limit);
    console.log(`✅ [API] Found ${result.data.length} news items`);

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("❌ [API] Error fetching news:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
