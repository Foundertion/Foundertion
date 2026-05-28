import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await resend.emails.send({
      from: "Foundertion <onboarding@resend.dev>",
      to: "foundertionrizky@gmail.com",
      subject: "🚀 New Waitlist Signup!",
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px">
          <h2 style="color:#3fcf8e">New Foundertion Waitlist Signup!</h2>
          <p>Email: <strong>${email}</strong></p>
          <p>Time: ${new Date().toLocaleString()}</p>
          <hr/>
          <p style="color:#666;font-size:12px">Foundertion — AI Co-Founder for Solo Founders</p>
        </div>
      `,
    });

    await resend.emails.send({
      from: "Foundertion <onboarding@resend.dev>",
      to: email,
      subject: "🚀 You're on the Foundertion waitlist!",
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;background:#0b1a12;color:#e8ede9;border-radius:12px">
          <h2 style="color:#3fcf8e">Welcome to Foundertion! 🎉</h2>
          <p>You're officially on the waitlist. We'll notify you when new features drop.</p>
          <p style="color:#3fcf8e;font-weight:bold">While you wait — try Foundertion now:</p>
          <a href="https://foundertion.vercel.app" style="display:inline-block;background:#3fcf8e;color:#0b1a12;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:10px 0">
            Launch Foundertion →
          </a>
          <p style="color:#4a7060;font-size:12px;margin-top:20px">
            Don't quit at 70-85%. Ship it. 🚢<br/>
            — Foundertion Team
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
  }
}
