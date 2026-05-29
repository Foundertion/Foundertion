import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "No API key" }, { status: 500 });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "Foundertion <onboarding@resend.dev>",
      to: "foundertionrizky@gmail.com",
      subject: "New Waitlist Signup!",
      html: `<div style="font-family:sans-serif;padding:20px"><h2 style="color:#3fcf8e">New Signup!</h2><p>Email: <strong>${email}</strong></p><p>Time: ${new Date().toLocaleString()}</p></div>`,
    });

    await resend.emails.send({
      from: "Foundertion <onboarding@resend.dev>",
      to: email,
      subject: "You are on the Foundertion waitlist!",
      html: `<div style="font-family:sans-serif;padding:20px;background:#0b1a12;color:#e8ede9;border-radius:12px"><h2 style="color:#3fcf8e">You are on the list! 🎉</h2><p>We will notify you when new features drop.</p><a href="https://foundertion.vercel.app" style="display:inline-block;background:#3fcf8e;color:#0b1a12;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:10px 0">Try Foundertion Now</a><p style="color:#4a7060;font-size:12px;margin-top:20px">Do not quit at 70-85%. Ship it.</p></div>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
