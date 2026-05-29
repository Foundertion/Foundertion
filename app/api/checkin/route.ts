import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { shipped, blocker, nextStep, memory } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "No API key" }, { status: 500 });

    const context = memory ? "Previous context: " + JSON.stringify(memory) : "";
    const prompt = "You are Foundertion — AI co-founder who pushes solo founders to ship.\n\n" + context + "\n\nToday check-in:\n- Shipped: " + shipped + "\n- Blocker: " + blocker + "\n- Next step: " + nextStep + "\n\nRespond in SAME language as answers. Give: 1) Validation 2) Blocker Breaker 3) Ship Nudge 4) Momentum status. Be direct, caring, celebrate wins.";

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 512,
        temperature: 0.8,
      }),
    });

    const data = await res.json();
    const response = data.choices?.[0]?.message?.content || "Keep shipping!";
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Checkin error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
