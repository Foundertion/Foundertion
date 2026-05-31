import { detectLanguage, SupportedLang } from "./lang-detector";

export interface IdeaInput {
  description: string;
  apiKey: string;
  productType?: string;
  targetUser?: string;
  problem?: string;
}

export interface GenerateResults {
  detectedLang: SupportedLang;
  validation: string;
  plan: string;
  pitch: string;
  landing: string;
}

const SYSTEM_PROMPT = `You are Foundertion AI Research Engine. Your job is to help founders validate ideas and ship products — NOT generate fictional business plans.

ABSOLUTE RULES (never violate):
1. NEVER make up numbers, market sizes, TAM/SAM/SOM, revenue projections, or traction claims
2. NEVER give idea scores or ratings (X/10) — only founders and real users can validate ideas
3. NEVER write 90-day business plans — only 7-day ship checklists
4. NEVER claim competitor metrics unless publicly verifiable
5. If no data found, say exactly: "No strong signals found — validate with real users"
6. ALWAYS suggest at least one 48-hour validation test
7. ALWAYS recommend specific tools with free tiers
8. ALWAYS end with disclaimer and CTA to Foundertion community
9. Be honest, direct, and actionable — founders need truth, not hype
10. Respond in the SAME language as the user input (auto-detect)`;

async function callGroq(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "Error generating.";
}

const DISCLAIMER = `⚠️ DISCLAIMER: This analysis is AI-generated based on patterns and reasoning, NOT scraped live data. All claims are unvalidated. Test with real users within 48 hours before making any business decisions.`;

const FORBIDDEN = `
CRITICAL RULES — NEVER violate these:
- NEVER write TAM/SAM/SOM or any market size numbers
- NEVER give an idea score (X/10)
- NEVER claim traction ("users love it", "growing fast")
- NEVER write 90-day business plans
- NEVER make revenue projections
- NEVER invent competitor metrics
- If you don't know something, say "Unknown — validate with real users"
- Every claim must be something the founder can verify themselves
`;

function getProductContext(productType: string): string {
  const contexts: Record<string, string> = {
    webapp: "Web App (SaaS, marketplace, directory). Key platforms: Product Hunt, Indie Hackers, Hacker News.",
    mobile: "Mobile App (iOS/Android). Key platforms: App Store, Google Play, TestFlight.",
    bot: "Bot (Discord/Telegram/WhatsApp). Key platforms: Top.gg, Discord Bot List, r/discordbots.",
    extension: "Browser Extension. Key platforms: Chrome Web Store, Firefox Add-ons.",
    newsletter: "Newsletter/Content Business. Key platforms: Beehiiv, Substack, ConvertKit.",
    api: "API/Backend Service. Key platforms: RapidAPI, GitHub, Hacker News.",
    physical: "Physical Product. Key platforms: Shopify, Etsy, Kickstarter.",
    plugin: "Plugin/Add-on (WordPress, Figma, etc). Key platforms: WordPress.org, Figma Community.",
    general: "General/Undecided product type.",
  };
  return contexts[productType] || contexts.general;
}

function getToolsStack(productType: string): string {
  const stacks: Record<string, string> = {
    webapp: `## RECOMMENDED TOOLS STACK
- **Landing Page:** Framer (free tier) or v0.dev
- **Auth + Database:** Supabase (free tier — 500MB)
- **Hosting:** Vercel (free tier)
- **Payments:** Stripe (free until you earn)
- **Domain:** Namecheap (~$10-15/year)
- **AI:** Groq API (free tier) or Claude API
- **Total to start:** $0-15`,
    mobile: `## RECOMMENDED TOOLS STACK
- **Framework:** Expo + React Native (free, cross-platform)
- **Backend:** Supabase (free tier)
- **Payments:** RevenueCat (free up to $2.5K/mo)
- **Analytics:** PostHog (free tier)
- **Total to start:** $0`,
    bot: `## RECOMMENDED TOOLS STACK
- **Discord Bot:** discord.js (Node.js) — free
- **Hosting:** Railway (free trial) or Fly.io (free tier)
- **Database:** Supabase (free tier)
- **Total to start:** $0`,
    extension: `## RECOMMENDED TOOLS STACK
- **Build:** Plasmo Framework (free, Chrome/Firefox/Safari)
- **Storage:** Chrome Storage API (free, built-in)
- **Backend (if needed):** Supabase (free tier)
- **Store fee:** Chrome Web Store = $5 one-time
- **Total to start:** $0-5`,
    newsletter: `## RECOMMENDED TOOLS STACK
- **Platform:** Beehiiv (free up to 2,500 subs)
- **Alternative:** Substack (free, takes 10% of revenue)
- **Landing page:** Framer or Carrd
- **Total to start:** $0`,
    api: `## RECOMMENDED TOOLS STACK
- **Framework:** FastAPI (Python) or Express (Node.js) — free
- **Hosting:** Railway (free trial) or Render (free tier)
- **Docs:** Swagger/OpenAPI (built-in with FastAPI)
- **Marketplace:** RapidAPI (free to list)
- **Total to start:** $0`,
    general: `## RECOMMENDED TOOLS STACK
- **Landing Page:** Carrd ($19/year) or Framer (free)
- **Waitlist:** Tally (free) or Google Forms
- **Auth + Database:** Supabase (free tier)
- **Hosting:** Vercel (free)
- **Total to start:** $0-19`,
  };
  return stacks[productType] || stacks.general;
}

export async function generateLocally(input: IdeaInput): Promise<GenerateResults> {
  const { description, apiKey, productType = "general", targetUser = "", problem = "" } = input;
  const detectedLang = detectLanguage(description);
  const langInstr = `Respond ENTIRELY in the same language as the user's idea (detected: ${detectedLang}). Do NOT switch languages.`;
  const productCtx = getProductContext(productType);
  const toolsStack = getToolsStack(productType);
  const context = `
Idea: "${description}"
Product Type: ${productCtx}
Target User: ${targetUser || "Not specified"}
Problem: ${problem || "Not specified"}
`;

  const [validation, plan, pitch, landing] = await Promise.all([

    // VALIDATION — Real signals, red flags, validation tests
    callGroq(apiKey, `You are a sharp, honest startup researcher. ${langInstr}
${FORBIDDEN}

${context}

Write a REAL SIGNALS analysis. Be honest — if signals are weak, say so.

## REAL SIGNALS
[List 3-5 observable signals that suggest this problem exists. Each signal must be something the founder can verify themselves: a Reddit thread, a job posting, a competitor, a trending search term. Format: "Signal: [description] → Where to verify: [specific URL pattern or platform]"]

[If signals are weak: "No strong public signals found. This could mean: (a) untapped opportunity, or (b) low demand. The only way to know is to test."]

## RED FLAGS
[List 2-4 honest risks. Include: well-funded competitors if known, technical risks, legal risks, market timing risks. Be specific, not generic.]

[If no obvious red flags: "No obvious red flags — but absence of evidence is not evidence of absence."]

## VALIDATION TEST (Choose 1, Execute in 48 Hours)

**Option A — Landing Test**
[Specific landing page idea for this product + where to share it + what to measure]

**Option B — Survey Test**
[Specific survey questions for this product + where to post it + what a positive signal looks like]

**Option C — Direct Test**
[The fastest possible prototype for this specific product type + how to get first 5 users]

## HONEST VERDICT
[2-3 sentences. Honest assessment: Is the problem real? What's the ONE thing to validate first? No hype, no fake confidence.]`),

    // SHIP CHECKLIST — 1 week, not 90 days
    callGroq(apiKey, `You are a no-BS startup coach who has helped 100+ founders ship their first product. ${langInstr}
${FORBIDDEN}

${context}

Write a 7-DAY SHIP CHECKLIST. This is NOT a business plan. This is a day-by-day action list to get something live in front of real users.

## 7-DAY SHIP CHECKLIST

**Day 1 — Validate (Before Building Anything)**
- [ ] [Specific task: post in X community, DM X people, set up landing page]
- [ ] [Specific task]
- [ ] [Specific task]
**Goal:** [Specific measurable outcome — e.g., "5 people say they'd use this"]

**Day 2 — Setup**
- [ ] [Dev environment or tool setup specific to this product type]
- [ ] [Account setup: domain, hosting, database]
- [ ] [Design: 1 wireframe or sketch]
**Goal:** [Ready to build]

**Day 3-4 — Build Core Only**
- [ ] [The ONE core feature that delivers the value — nothing else]
- [ ] [Basic auth or access control if needed]
- [ ] [Data storage if needed]
**Goal:** [Something that technically works, even if ugly]

**Day 5 — Get It in Front of People**
- [ ] [Deploy to production or TestFlight or Chrome Store]
- [ ] [Share with 5 specific people — describe who and how]
- [ ] [Collect feedback via specific method]
**Goal:** [5 real humans try it]

**Day 6 — One Fix**
- [ ] [Fix the ONE biggest complaint from Day 5]
- [ ] [Do NOT add new features]
**Goal:** ["It's usable enough to share publicly"]

**Day 7 — Ship Publicly**
- [ ] [Post on specific platforms for this product type]
- [ ] [Write 1 honest post about what you built and why]
- [ ] [Join Foundertion Discord and post in #ship-showcase]
**Goal:** [Public URL/link that anyone can access]

## ANTI-SCOPE-CREEP RULES
[3 specific things this founder should NOT build in week 1, specific to their idea]

${toolsStack}`),

    // PITCH — Honest, no fake traction
    callGroq(apiKey, `You are a straight-talking pitch coach. ${langInstr}
${FORBIDDEN}

${context}

Write a 90-second founder pitch. This is for talking to potential users, not investors. No fake traction, no made-up numbers.

## 90-SECOND USER PITCH

**The Hook (10s):**
[A question or statement that makes your target user nod their head. Must reference a real pain they feel.]

**The Problem (20s):**
[Describe the pain in their words. Specific scenario, not abstract. What does a bad day look like for them?]

**The Solution (20s):**
[One sentence: "We built X that does Y for Z." Simple. No jargon.]

**Why You (15s):**
[Why are YOU the right person to build this? Personal story, relevant experience, or unfair advantage. Be honest.]

**The Ask (10s):**
[Not money. Ask for: a 15-minute call, beta access signup, or feedback on a prototype. Low commitment.]

**Closing (15s):**
[Repeat the pain + how your solution removes it. End with a question that invites conversation.]

---
*Note: This pitch is for validation conversations, not investor meetings. Keep it conversational.*`),

    // LANDING PAGE — Honest copy, no fake social proof
    callGroq(apiKey, `You are a conversion copywriter who hates bullshit. ${langInstr}
${FORBIDDEN}

${context}

Write landing page copy for a VALIDATION page (not a full product page). This is for testing if people want this before building it.

## VALIDATION LANDING PAGE COPY

**Headline:** [8 words max. Clear benefit, not clever wordplay. Must speak to the pain directly.]

**Subheadline:** [20 words max. Explain what it does and for whom. No buzzwords.]

**The Pain Section:**
[3 bullet points. Each one: a specific, painful moment your target user experiences. Use "you" language.]
- You...
- You...
- You...

**The Promise:**
[One paragraph, max 3 sentences. What life looks like after using your product. No superlatives, no hype.]

**What You Get (MVP Only):**
[3-5 bullet points. Only features that exist or will exist in week 1. Be honest about what's NOT included yet.]
- ✓ [Feature]
- ✓ [Feature]
- ✓ [Feature]
- 🚧 Coming soon: [Future feature — be transparent]

**Primary CTA:** [Action-oriented, low-commitment. "Join Waitlist" or "Get Early Access" or "Try Free"]

**Risk Reducer:** [One sentence that removes the biggest objection. E.g., "No credit card required. Cancel anytime."]

**FAQ (3 questions):**
Q: [The most common objection]
A: [Honest answer]

Q: [Second most common objection]
A: [Honest answer]

Q: [When will it be ready?]
A: [Honest timeline or "Building in public — join waitlist to follow progress"]`)
  ]);

  const disclaimer = DISCLAIMER;
  return {
    detectedLang,
    validation: disclaimer + "\n\n" + validation,
    plan: disclaimer + "\n\n" + plan,
    pitch: disclaimer + "\n\n" + pitch,
    landing: disclaimer + "\n\n" + landing,
  };
}
