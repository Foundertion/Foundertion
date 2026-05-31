import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Tools for Solo Founders — Foundertion",
  description: "Curated free and affordable tools for solo founders. Tested and recommended by Foundertion community.",
};

const TOOLS = [
  {
    category: "🌐 Domain & Hosting",
    items: [
      { name: "Namecheap", desc: "Cheapest domains (~$9-15/year). Best for solo founders on budget.", price: "From $9/year", badge: "Recommended", url: "https://namecheap.pxf.io/foundertion", free: false },
      { name: "Vercel", desc: "Deploy Next.js apps in seconds. Free tier is incredibly generous.", price: "Free tier", badge: "We use this", url: "https://vercel.com", free: true },
      { name: "Cloudflare", desc: "Free DNS, CDN, and DDoS protection. Must-have for any project.", price: "Free", badge: "Free", url: "https://cloudflare.com", free: true },
    ]
  },
  {
    category: "🗄️ Database & Auth",
    items: [
      { name: "Supabase", desc: "Postgres database + auth + storage. Free tier = 500MB. We use this.", price: "Free tier", badge: "We use this", url: "https://supabase.com", free: true },
      { name: "PlanetScale", desc: "MySQL serverless database. Great for high-traffic apps.", price: "Free tier", badge: "Free", url: "https://planetscale.com", free: true },
      { name: "Clerk", desc: "Auth in minutes. Beautiful UI. Better UX than rolling your own.", price: "Free up to 10K MAU", badge: "Easy Auth", url: "https://clerk.com", free: true },
    ]
  },
  {
    category: "🤖 AI & LLM",
    items: [
      { name: "Groq API", desc: "Fastest LLM inference. Free tier. Llama 3.3 70B is excellent.", price: "Free tier", badge: "We use this", url: "https://console.groq.com", free: true },
      { name: "Claude API", desc: "Best reasoning and coding. Use for complex tasks.", price: "Pay per use", badge: "Best Quality", url: "https://console.anthropic.com", free: false },
      { name: "OpenRouter", desc: "Access 100+ models with one API. Great for testing.", price: "Pay per use", badge: "Multi-model", url: "https://openrouter.ai", free: false },
    ]
  },
  {
    category: "🎨 Design & Frontend",
    items: [
      { name: "v0.dev", desc: "Generate UI with AI. Ships Tailwind + shadcn. Game changer.", price: "Free tier", badge: "AI Design", url: "https://v0.dev", free: true },
      { name: "Framer", desc: "Best landing pages. No code. Fast. Beautiful.", price: "Free tier", badge: "Landing Pages", url: "https://framer.com", free: true },
      { name: "Figma", desc: "Industry standard design tool. Free for solo founders.", price: "Free", badge: "Free", url: "https://figma.com", free: true },
    ]
  },
  {
    category: "💳 Payments",
    items: [
      { name: "Stripe", desc: "Standard for SaaS payments. Easy API. 2.9% + 30¢ per transaction.", price: "2.9% + 30¢", badge: "Standard", url: "https://stripe.com", free: true },
      { name: "Lemon Squeezy", desc: "Merchant of record. Handles VAT/taxes globally. Great for digital products.", price: "5% + 50¢", badge: "Global Friendly", url: "https://lemonsqueezy.com", free: true },
      { name: "Polar.sh", desc: "Open source, developer-friendly. Great for SaaS + open source.", price: "4% fee", badge: "Dev Friendly", url: "https://polar.sh", free: true },
    ]
  },
  {
    category: "📧 Email & Newsletter",
    items: [
      { name: "Resend", desc: "Best transactional email API for developers. Free 3K emails/month.", price: "Free 3K/mo", badge: "We use this", url: "https://resend.com", free: true },
      { name: "Beehiiv", desc: "Best newsletter platform. Free up to 2,500 subscribers.", price: "Free 2.5K subs", badge: "Best Newsletter", url: "https://beehiiv.com", free: true },
      { name: "Loops", desc: "Email automation for SaaS. Better than Mailchimp for developers.", price: "Free tier", badge: "SaaS Email", url: "https://loops.so", free: true },
    ]
  },
  {
    category: "📊 Analytics",
    items: [
      { name: "Vercel Analytics", desc: "Privacy-friendly, built into Vercel. Zero config.", price: "Free", badge: "We use this", url: "https://vercel.com/analytics", free: true },
      { name: "PostHog", desc: "Open source. Product analytics + session replay + feature flags.", price: "Free 1M events/mo", badge: "Recommended", url: "https://posthog.com", free: true },
      { name: "Plausible", desc: "Privacy-first Google Analytics alternative. Simple and clean.", price: "$9/mo", badge: "Privacy First", url: "https://plausible.io", free: false },
    ]
  },
  {
    category: "🚀 Launch & Distribution",
    items: [
      { name: "Product Hunt", desc: "Launch your product to thousands of early adopters.", price: "Free", badge: "Free", url: "https://producthunt.com", free: true },
      { name: "Indie Hackers", desc: "Community of solo founders. Share milestones, get feedback.", price: "Free", badge: "Community", url: "https://indiehackers.com", free: true },
      { name: "Tally", desc: "Best free form builder. No-code. Unlimited forms.", price: "Free", badge: "Free Forms", url: "https://tally.so", free: true },
    ]
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[#0b1a12] text-[#e8ede9]" style={{fontFamily:"'DM Sans',sans-serif"}}>
      <header style={{borderBottom:"1px solid #1e3d2a",padding:"1rem 1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#0b1a12",position:"sticky",top:0,zIndex:50}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:"0.6rem",textDecoration:"none"}}>
          <img src="/android-chrome-192.png" alt="Foundertion" style={{height:"28px",width:"28px",borderRadius:"8px"}} />
          <span style={{fontWeight:700,fontSize:"1rem",color:"#3fcf8e"}}>Foundertion</span>
        </a>
        <div style={{display:"flex",gap:"0.8rem"}}>
          <a href="/dashboard" style={{fontSize:"0.75rem",color:"#4a7060",textDecoration:"none"}}>Dashboard</a>
          <a href="/" style={{fontSize:"0.75rem",color:"#3fcf8e",textDecoration:"none"}}>Try AI Tool →</a>
        </div>
      </header>

      <main style={{maxWidth:"860px",margin:"0 auto",padding:"2.5rem 1.5rem"}}>
        <div style={{textAlign:"center",marginBottom:"3rem"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",background:"#3fcf8e15",border:"1px solid #3fcf8e30",borderRadius:"20px",padding:"0.3rem 0.9rem",marginBottom:"1rem"}}>
            <span style={{fontSize:"0.65rem",color:"#3fcf8e",letterSpacing:"0.12em",fontWeight:700}}>CURATED BY FOUNDERTION</span>
          </div>
          <h1 style={{fontSize:"2.2rem",fontWeight:900,marginBottom:"0.8rem",lineHeight:1.2}}>
            Tools for <span style={{color:"#3fcf8e"}}>Solo Founders</span>
          </h1>
          <p style={{color:"#4a7060",fontSize:"0.9rem",maxWidth:"480px",margin:"0 auto",lineHeight:1.7}}>
            Tested and used by real founders. Most have free tiers. No fluff, no sponsored rankings — just what actually works.
          </p>
          <p style={{fontSize:"0.7rem",color:"#2a3d32",marginTop:"0.8rem"}}>
            * Some links are affiliate links. We earn a small commission at no extra cost to you. This helps keep Foundertion free.
          </p>
        </div>

        {TOOLS.map((cat) => (
          <div key={cat.category} style={{marginBottom:"2.5rem"}}>
            <h2 style={{fontSize:"1rem",fontWeight:700,marginBottom:"1rem",color:"#e8ede9",paddingBottom:"0.5rem",borderBottom:"1px solid #1e3d2a"}}>
              {cat.category}
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"0.8rem"}}>
              {cat.items.map((tool) => (
                <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer"
                  style={{background:"#0f2118",border:"1px solid #1e3d2a",borderRadius:"12px",padding:"1.1rem",textDecoration:"none",display:"flex",flexDirection:"column",gap:"0.5rem",transition:"border-color 0.2s",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:"0.6rem",right:"0.6rem"}}>
                    <span style={{fontSize:"0.6rem",background: tool.badge === "We use this" ? "#3fcf8e20" : "#1e3d2a",color: tool.badge === "We use this" ? "#3fcf8e" : "#4a7060",padding:"0.15rem 0.45rem",borderRadius:"4px",fontWeight:700,border: tool.badge === "We use this" ? "1px solid #3fcf8e40" : "1px solid #1e3d2a"}}>
                      {tool.badge}
                    </span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                    <span style={{fontWeight:700,color:"#e8ede9",fontSize:"0.92rem"}}>{tool.name}</span>
                    {tool.free && <span style={{fontSize:"0.6rem",color:"#3fcf8e",background:"#3fcf8e10",padding:"0.1rem 0.35rem",borderRadius:"4px",border:"1px solid #3fcf8e25"}}>FREE</span>}
                  </div>
                  <p style={{fontSize:"0.78rem",color:"#4a7060",lineHeight:1.5,margin:0}}>{tool.desc}</p>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"0.3rem"}}>
                    <span style={{fontSize:"0.72rem",color:"#2a9e6a",fontWeight:600}}>{tool.price}</span>
                    <span style={{fontSize:"0.7rem",color:"#3fcf8e"}}>Visit →</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}

        <div style={{textAlign:"center",marginTop:"3rem",padding:"2rem",background:"#0f2118",border:"1px solid #1e3d2a",borderRadius:"16px"}}>
          <p style={{fontSize:"0.85rem",color:"#4a7060",marginBottom:"1rem"}}>Missing a tool? Want to suggest something?</p>
          <a href="/" style={{display:"inline-block",background:"#3fcf8e",color:"#0b1a12",padding:"0.7rem 1.5rem",borderRadius:"10px",textDecoration:"none",fontWeight:700,fontSize:"0.85rem"}}>
            Join Foundertion Community →
          </a>
        </div>
      </main>

      <footer style={{textAlign:"center",padding:"2rem",fontSize:"0.72rem",color:"#2a3d32",borderTop:"1px solid #1e3d2a",marginTop:"2rem"}}>
        Foundertion · AI-Native Founder Community · foundertion.vercel.app
      </footer>
    </div>
  );
}
