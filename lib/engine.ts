import { detectLanguage, SupportedLang } from "./lang-detector";

export interface IdeaInput {
  description: string;
  apiKey: string;
}

export interface GenerateResults {
  detectedLang: SupportedLang;
  validation: string;
  plan: string;
  pitch: string;
  landing: string;
}

async function callGroq(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "Error generating.";
}

export async function generateLocally(input: IdeaInput): Promise<GenerateResults> {
  const { description, apiKey } = input;
  const detectedLang = detectLanguage(description);

  const langInstr = `Respond ENTIRELY in the same language as this idea (detected: ${detectedLang}). Do NOT switch languages.`;

  const [validation, plan, pitch, landing] = await Promise.all([
    callGroq(apiKey, `You are a world-class startup analyst. ${langInstr}

Analyze this startup idea: "${description}"

## IDEA SCORE: [X/10]
**One-liner:** [one powerful sentence]

## MARKET ANALYSIS
**Market Size:** [TAM/SAM/SOM]
**Target Customer:** [specific persona]
**Problem Severity:** [1-10]

## STRENGTHS
1. [strength]
2. [strength]
3. [strength]

## RISKS
1. [risk + mitigation]
2. [risk + mitigation]
3. [risk + mitigation]

## COMPETITION
[2-3 competitors + differentiation]

## VERDICT
[2-3 sentences. Build this? #1 thing to validate?]`),

    callGroq(apiKey, `You are a serial entrepreneur. ${langInstr}

Create a 90-day plan for: "${description}"

## BUSINESS PLAN: [Product Name]
**Mission:** [one sentence]
**Revenue Model:** [specific]
**Pricing:** [concrete tiers]

## DAY 1-30: VALIDATE
- [ ] [action]
- [ ] [action]
- [ ] [action]
- [ ] [action]
**Goal:** [milestone]

## DAY 31-60: BUILD MVP
- [ ] [action]
- [ ] [action]
- [ ] [action]
**Goal:** [milestone]

## DAY 61-90: LAUNCH
- [ ] [action]
- [ ] [action]
- [ ] [action]
**Goal:** [milestone]

## FINANCIAL PROJECTION (Month 3)
- MRR Target: [amount]
- Customers: [number]
- CAC: [amount]
- Burn Rate: [amount]

## TECH STACK
[Simple MVP stack]`),

    callGroq(apiKey, `You are a pitch coach. ${langInstr}

Write a 2-minute investor pitch for: "${description}"

## PITCH: [Product Name]
**HOOK (15s):** [shocking stat or pain]
**PROBLEM (20s):** [vivid pain scenario]
**SOLUTION (20s):** [We built X that does Y for Z]
**TRACTION (20s):** [any signal]
**MARKET (15s):** [big number narrowed]
**BUSINESS MODEL (15s):** [how you make money]
**THE ASK (15s):** [how much, for what, why now]
**CLOSING LINE:** [one memorable sentence]`),

    callGroq(apiKey, `You are a conversion copywriter. ${langInstr}

Write landing page copy for: "${description}"

## HERO SECTION
**Headline:** [max 8 words]
**Subheadline:** [max 20 words]
**Primary CTA:** [button text]
**Risk reducer:** [answer #1 objection]

## PROBLEM SECTION
**Headline:** [empathy-driven]
- [pain point 1]
- [pain point 2]
- [pain point 3]

## SOLUTION SECTION
**Headline:** [transformation]
- [benefit 1]
- [benefit 2]
- [benefit 3]

## SOCIAL PROOF
1. "[quote]" — [Name, Role]
2. "[quote]" — [Name, Role]

## PRICING
- Free: [what's included]
- Pro $9/mo: [what's included]

## FAQ
Q: [objection 1]
A: [answer]
Q: [objection 2]
A: [answer]

## FINAL CTA
**Headline:** [urgency]
**CTA:** [action]
**Risk reversal:** [guarantee]`),
  ]);

  return { detectedLang, validation, plan, pitch, landing };
}
