import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { shipped, blocker, nextStep, memory } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "No API key" },
        { status: 500 }
      );
    }

    const prompt = `
You are Foundertion — an AI co-founder who remembers everything and pushes solo founders to ship.

${memory ? `Previous context: ${JSON.stringify(memory)}` : ""}

Today's check-in:
- Shipped yesterday: "${shipped}"
- Blocker: "${blocker}"
- Next 2-hour step: "${nextStep}"
`;

    const res = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: \`Bearer \${apiKey}\`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 512,
          temperature: 0.8,
        }),
      }
    );

    const data = await res.json();

    const response =
      data.choices?.[0]?.message?.content ||
      "Keep shipping!";

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Checkin error:", error);

    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}
