import { NextRequest, NextResponse } from "next/server";
import { generateLocally } from "@/lib/engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { description } = body;

    if (!description || description.trim().length < 10) {
      return NextResponse.json(
        { error: "Description too short. Minimum 10 characters." },
        { status: 400 }
      );
    }

    const results = await generateLocally({ description });
    return NextResponse.json(results);

  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate results" },
      { status: 500 }
    );
  }
}