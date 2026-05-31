"use client";

import { useState } from "react";

const STACKS: Record<string, any> = {
  webapp: {
    label: "Web App (SaaS/Marketplace)",
    emoji: "🌐",
    tools: [
      { category: "Frontend", name: "Next.js", why: "SEO + API routes in one. Industry standard.", free: true, url: "https://nextjs.org", affiliate: false },
      { category: "Styling", name: "Tailwind CSS", why: "Fast, utility-first. No CSS headaches.", free: true, url: "https://tailwindcss.com", affiliate: false },
      { category: "UI Components", name: "shadcn/ui", why: "Beautiful components, copy-paste. Free forever.", free: true, url: "https://ui.shadcn.com", affiliate: false },
      { category: "Database + Auth", name: "Supabase", why: "Postgres + auth + storage. Free 500MB.", free: true, url: "https://supabase.com", affiliate: false },
      { category: "Hosting", name: "Vercel", why: "Deploy in seconds. Free tier very generous.", free: true, url: "https://vercel.com", affiliate: false },
      { category: "Domain", name: "Namecheap", why: "Cheapest domains. ~$9-15/year.", free: false, price: "$9-15/yr", url: "https://namecheap.pxf.io/foundertion", affiliate: true },
      { category: "Payments", name: "Stripe", why: "Standard. Easy API. 2.9% + 30¢.", free: true, url: "https://stripe.com", affiliate: false },
      { category: "Email", name: "Resend", why: "Best transactional email API. Free 3K/mo.", free: true, url: "https://resend.com", affiliate: false },
      { category: "Analytics", name: "PostHog", why: "Open source. Free 1M events/mo.", free: true, url: "https://posthog.com", affiliate: false },
    ],
    totalCost: "$0-15 to start",
    timeToShip: "3-7 days",
  },
  mobile: {
    label: "Mobile App (iOS/Android)",
    emoji: "📱",
    tools: [
      { category: "Framework", name: "Expo + React Native", why: "Cross-platform. Ship iOS + Android from one codebase.", free: true, url: "https://expo.dev", affiliate: false },
      { category: "Backend", name: "Supabase", why: "Postgres + auth + realtime. Free tier.", free: true, url: "https://supabase.com", affiliate: false },
      { category: "Payments", name: "RevenueCat", why: "In-app purchases made easy. Free up to $2.5K MRR.", free: true, url: "https://revenuecat.com", affiliate: false },
      { category: "Analytics", name: "PostHog", why: "Mobile analytics + session replay. Free tier.", free: true, url: "https://posthog.com", affiliate: false },
      { category: "Push Notifications", name: "Expo Notifications", why: "Built-in. Free. Zero setup.", free: true, url: "https://expo.dev/notifications", affiliate: false },
      { category: "OTA Updates", name: "Expo EAS", why: "Update app without App Store review. Free tier.", free: true, url: "https://expo.dev/eas", affiliate: false },
    ],
    totalCost: "$0 to start",
    timeToShip: "5-14 days",
  },
  bot: {
    label: "Discord/Telegram Bot",
    emoji: "🤖",
    tools: [
      { category: "Discord Framework", name: "discord.js", why: "Most popular Discord bot library. Great docs.", free: true, url: "https://discord.js.org", affiliate: false },
      { category: "Telegram Framework", name: "Telegraf", why: "Best Telegram bot framework for Node.js.", free: true, url: "https://telegraf.js.org", affiliate: false },
      { category: "Hosting", name: "Railway", why: "Deploy Node.js bots. Free trial, then $5/mo.", free: false, price: "$5/mo", url: "https://railway.app", affiliate: false },
      { category: "Database", name: "Supabase", why: "Store user data, commands, configs.", free: true, url: "https://supabase.com", affiliate: false },
      { category: "AI Integration", name: "Groq API", why: "Add AI to your bot. Free tier. Fast.", free: true, url: "https://console.groq.com", affiliate: false },
      { category: "Bot Discovery", name: "Top.gg", why: "List your Discord bot. Get organic users.", free: true, url: "https://top.gg", affiliate: false },
    ],
    totalCost: "$0-5/mo to start",
    timeToShip: "2-5 days",
  },
  extension: {
    label: "Browser Extension",
    emoji: "🧩",
    tools: [
      { category: "Framework", name: "Plasmo", why: "Build Chrome/Firefox/Safari extensions. React-based.", free: true, url: "https://plasmo.com", affiliate: false },
      { category: "Storage", name: "Chrome Storage API", why: "Built-in. Free. Sync across devices.", free: true, url: "https://developer.chrome.com/docs/extensions/reference/storage", affiliate: false },
      { category: "Backend (if needed)", name: "Supabase", why: "User auth + data sync. Free tier.", free: true, url: "https://supabase.com", affiliate: false },
      { category: "Payments", name: "Lemon Squeezy", why: "Easy one-time payments for extensions.", free: true, url: "https://lemonsqueezy.com", affiliate: false },
      { category: "Store", name: "Chrome Web Store", why: "$5 one-time developer fee. 2B+ potential users.", free: false, price: "$5 one-time", url: "https://chrome.google.com/webstore", affiliate: false },
    ],
    totalCost: "$5 one-time",
    timeToShip: "3-7 days",
  },
  newsletter: {
    label: "Newsletter / Content Business",
    emoji: "📧",
    tools: [
      { category: "Platform", name: "Beehiiv", why: "Best newsletter platform. Free up to 2,500 subs. Built-in monetization.", free: true, url: "https://beehiiv.com", affiliate: false },
      { category: "Landing Page", name: "Framer", why: "Beautiful landing pages. No code. Free tier.", free: true, url: "https://framer.com", affiliate: false },
      { category: "Domain", name: "Namecheap", why: "Custom domain for newsletter. ~$10/year.", free: false, price: "$10/yr", url: "https://namecheap.pxf.io/foundertion", affiliate: true },
      { category: "Social Scheduling", name: "Buffer", why: "Schedule posts. Free tier = 3 channels.", free: true, url: "https://buffer.com", affiliate: false },
      { category: "Design", name: "Canva", why: "Newsletter graphics. Free tier very good.", free: true, url: "https://canva.com", affiliate: false },
    ],
    totalCost: "$0-10 to start",
    timeToShip: "1-2 days",
  },
  api: {
    label: "API / Backend Service",
    emoji: "⚡",
    tools: [
      { category: "Framework", name: "FastAPI (Python)", why: "Auto-generates docs. Fast. Modern.", free: true, url: "https://fastapi.tiangolo.com", affiliate: false },
      { category: "Alternative", name: "Express (Node.js)", why: "Flexible. Huge ecosystem.", free: true, url: "https://expressjs.com", affiliate: false },
      { category: "Hosting", name: "Railway", why: "Deploy APIs easily. Free trial.", free: true, url: "https://railway.app", affiliate: false },
      { category: "Database", name: "Supabase", why: "Postgres + REST API auto-generated.", free: true, url: "https://supabase.com", affiliate: false },
      { category: "API Docs", name: "Scalar", why: "Beautiful API docs. Free. Better than Swagger UI.", free: true, url: "https://scalar.com", affiliate: false },
      { category: "Marketplace", name: "RapidAPI", why: "List your API. 4M+ developers discover APIs here.", free: true, url: "https://rapidapi.com", affiliate: false },
    ],
    totalCost: "$0 to start",
    timeToShip: "2-5 days",
  },
};

export default function StackPage() {
  const [selected, setSelected] = useState<string | null>(null);

  const stack = selected ? STACKS[selected] : null;

  return (
    <div style={{minHeight:"100vh",background:"#0b1a12",color:"#e8ede9",fontFamily:"'DM Sans',sans-serif"}}>
      <header style={{borderBottom:"1px solid #1e3d2a",padding:"1rem 1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#0b1a12",position:"sticky",top:0,zIndex:50}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:"0.6rem",textDecoration:"none"}}>
          <img src="/android-chrome-192.png" alt="Foundertion" style={{height:"28px",width:"28px",borderRadius:"8px"}} />
          <span style={{fontWeight:700,fontSize:"1rem",color:"#3fcf8e"}}>Foundertion</span>
        </a>
        <div style={{display:"flex",gap:"0.8rem"}}>
          <a href="/tools" style={{fontSize:"0.75rem",color:"#4a7060",textDecoration:"none"}}>All Tools</a>
          <a href="/" style={{fontSize:"0.75rem",color:"#3fcf8e",textDecoration:"none"}}>Try AI →</a>
        </div>
      </header>

      <main style={{maxWidth:"760px",margin:"0 auto",padding:"2.5rem 1.5rem"}}>
        <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
          <h1 style={{fontSize:"2rem",fontWeight:900,marginBottom:"0.6rem"}}>
            Smart <span style={{color:"#3fcf8e"}}>Stack Builder</span>
          </h1>
          <p style={{color:"#4a7060",fontSize:"0.88rem"}}>Pick your product type → get the exact stack to ship it this week.</p>
        </div>

        {/* Product type selector */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:"0.7rem",marginBottom:"2rem"}}>
          {Object.entries(STACKS).map(([key, val]) => (
            <button key={key} onClick={() => setSelected(key)}
              style={{background:selected===key?"#3fcf8e15":"#0f2118",border:`1px solid ${selected===key?"#3fcf8e":"#1e3d2a"}`,borderRadius:"12px",padding:"0.9rem 0.7rem",cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
              <div style={{fontSize:"1.5rem",marginBottom:"0.3rem"}}>{val.emoji}</div>
              <div style={{fontSize:"0.72rem",color:selected===key?"#3fcf8e":"#90b8a0",fontWeight:600,lineHeight:1.3}}>{val.label}</div>
            </button>
          ))}
        </div>

        {/* Stack result */}
        {stack && (
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <div style={{background:"#0f2118",border:"1px solid #3fcf8e40",borderRadius:"16px",padding:"1.5rem",marginBottom:"1.5rem",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:"linear-gradient(90deg,#3fcf8e,#2a9e6a)"}} />
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem",flexWrap:"wrap",gap:"0.5rem"}}>
                <h2 style={{fontSize:"1rem",fontWeight:700,color:"#e8ede9",margin:0}}>{stack.emoji} {stack.label} Stack</h2>
                <div style={{display:"flex",gap:"1rem"}}>
                  <span style={{fontSize:"0.72rem",color:"#3fcf8e",fontWeight:700}}>💰 {stack.totalCost}</span>
                  <span style={{fontSize:"0.72rem",color:"#4a7060"}}>⏱ Ship in {stack.timeToShip}</span>
                </div>
              </div>

              <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
                {stack.tools.map((tool: any, i: number) => (
                  <a key={i} href={tool.url} target="_blank" rel="noopener noreferrer"
                    style={{display:"flex",alignItems:"flex-start",gap:"0.8rem",padding:"0.85rem",background:"#0b1a12",borderRadius:"10px",border:"1px solid #1e3d2a",textDecoration:"none",transition:"border-color 0.2s"}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.2rem",flexWrap:"wrap"}}>
                        <span style={{fontSize:"0.65rem",color:"#4a7060",fontWeight:700,letterSpacing:"0.08em"}}>{tool.category.toUpperCase()}</span>
                        {tool.free && <span style={{fontSize:"0.58rem",color:"#3fcf8e",background:"#3fcf8e10",padding:"0.08rem 0.3rem",borderRadius:"4px",border:"1px solid #3fcf8e25"}}>FREE</span>}
                        {tool.affiliate && <span style={{fontSize:"0.58rem",color:"#f59e0b",background:"#f59e0b10",padding:"0.08rem 0.3rem",borderRadius:"4px",border:"1px solid #f59e0b25"}}>affiliate</span>}
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                        <span style={{fontWeight:700,color:"#e8ede9",fontSize:"0.88rem"}}>{tool.name}</span>
                        {tool.price && <span style={{fontSize:"0.72rem",color:"#2a9e6a"}}>{tool.price}</span>}
                      </div>
                      <p style={{fontSize:"0.75rem",color:"#4a7060",margin:"0.2rem 0 0",lineHeight:1.5}}>{tool.why}</p>
                    </div>
                    <span style={{fontSize:"0.7rem",color:"#3fcf8e",flexShrink:0,marginTop:"0.2rem"}}>→</span>
                  </a>
                ))}
              </div>
            </div>

            <div style={{background:"#0f2118",border:"1px solid #1e3d2a",borderRadius:"12px",padding:"1rem 1.2rem",fontSize:"0.72rem",color:"#4a7060",lineHeight:1.6}}>
              * Links marked "affiliate" earn Foundertion a small commission at no extra cost to you. This helps keep Foundertion free.
            </div>

            <div style={{textAlign:"center",marginTop:"1.5rem"}}>
              <a href="/" style={{display:"inline-block",background:"#3fcf8e",color:"#0b1a12",padding:"0.7rem 1.5rem",borderRadius:"10px",textDecoration:"none",fontWeight:700,fontSize:"0.85rem"}}>
                Validate Your Idea First →
              </a>
            </div>
          </div>
        )}

        {!stack && (
          <div style={{textAlign:"center",padding:"3rem",color:"#2a3d32",fontSize:"0.85rem"}}>
            ↑ Pick a product type to see your stack
          </div>
        )}
      </main>

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <footer style={{textAlign:"center",padding:"2rem",fontSize:"0.72rem",color:"#2a3d32",borderTop:"1px solid #1e3d2a",marginTop:"2rem"}}>
        Foundertion · AI-Native Founder Community · foundertion.vercel.app
      </footer>
    </div>
  );
}
