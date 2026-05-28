import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.GROQ_API_KEY;
  return NextResponse.json({
    hasKey: !!key,
    keyPrefix: key ? key.slice(0, 8) + "..." : "NOT FOUND"
  });
}
