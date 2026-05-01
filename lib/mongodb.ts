import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Missing MONGODB_URI in environment");
}
const mongoUri = uri;

let cachedClient: MongoClient | null = null;

export async function getClient(): Promise<MongoClient> {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(mongoUri);
  await client.connect();
  cachedClient = client;
  return client;
}

export async function getNewsCollection() {
  const client = await getClient();
  const db = client.db("New_application");
  return db.collection("filtered_news");
}

export async function fetchNews(page = 1, limit = 20) {
  const coll = await getNewsCollection();
  const skip = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    coll.find({}).sort({ ingested_at: -1 }).skip(skip).limit(limit).toArray(),
    coll.countDocuments(),
  ]);

  return {
    data: docs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
}

export async function fetchNewsById(id: string) {
  const coll = await getNewsCollection();
  try {
    const doc = await coll.findOne({ _id: new ObjectId(id) });
    return doc;
  } catch {
    return null;
  }
}

export async function fetchNewsByCategory(
  category: string,
  page = 1,
  limit = 20,
) {
  const coll = await getNewsCollection();
  const query: Record<string, any> = {};

  if (category === "global") query.global = true;
  else if (category === "commodities") query.commodities = true;
  else if (category === "sector")
    query.sector_market = { $exists: true, $ne: "" };

  const skip = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    coll
      .find(query)
      .sort({ ingested_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    coll.countDocuments(query),
  ]);

  return {
    data: docs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
}

export async function fetchNewsByCompany(
  companyName: string,
  page = 1,
  limit = 20,
) {
  const coll = await getNewsCollection();
  const skip = (page - 1) * limit;

  const query = {
    companies: { $regex: companyName, $options: "i" },
    sector: "Company Specific",
  };

  const [docs, total] = await Promise.all([
    coll
      .find(query)
      .sort({ ingested_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    coll.countDocuments(query),
  ]);

  return {
    data: docs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
}

export async function fetchNewsBySector(
  sectorName: string,
  page = 1,
  limit = 20,
) {
  const coll = await getNewsCollection();
  const skip = (page - 1) * limit;

  const query = {
    sector: { $regex: sectorName, $options: "i" },
  };

  const [docs, total] = await Promise.all([
    coll
      .find(query)
      .sort({ ingested_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    coll.countDocuments(query),
  ]);

  return {
    data: docs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
}

export async function searchNews(searchTerm: string, page = 1, limit = 20) {
  const coll = await getNewsCollection();
  const skip = (page - 1) * limit;

  const query = {
    $or: [
      { Headline: { $regex: searchTerm, $options: "i" } },
      { summary: { $regex: searchTerm, $options: "i" } },
      { companies: { $regex: searchTerm, $options: "i" } },
      { sector: { $regex: searchTerm, $options: "i" } },
    ],
  };

  const [docs, total] = await Promise.all([
    coll
      .find(query)
      .sort({ ingested_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    coll.countDocuments(query),
  ]);

  return {
    data: docs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
}

export async function getStats() {
  const coll = await getNewsCollection();
  const [
    totalCount,
    globalCount,
    commoditiesCount,
    bullishCount,
    bearishCount,
  ] = await Promise.all([
    coll.countDocuments(),
    coll.countDocuments({ global: true }),
    coll.countDocuments({ commodities: true }),
    coll.countDocuments({ sentiment: "Bullish" }),
    coll.countDocuments({ sentiment: "Bearish" }),
  ]);

  return {
    total: totalCount,
    global: globalCount,
    commodities: commoditiesCount,
    bullish: bullishCount,
    bearish: bearishCount,
  };
}
