import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog — Foundertion",
  description: "Follow Foundertion's build journey. Every feature, fix, and improvement — logged publicly.",
};

const CHANGELOG = [
  {
    date: "Jun 1, 2026",
    items: [
      { type: "feat", text: "Google OAuth — Sign in with Google" },
      { type: "feat", text: "GitHub OAuth — Sign in with GitHub" },
      { type: "fix", text: "Language detection improved — English now prioritized correctly" },
      { type: "feat", text: "Impact.com affiliate verification" },
    ]
  },
  {
    date: "May 31, 2026",
    items: [
      { type: "feat", text: "/stack page — Smart Stack Builder per product type" },
      { type: "feat", text: "/tools page — Curated tools directory with affiliate links" },
      { type: "feat", text: "/links page — Bio link page for Instagram/X" },
      { type: "feat", text: "Discord community launched — discord.gg/fxUEHJgg8" },
      { type: "feat", text: "AI Generator 2.0 — Real signals, 7-day ship checklist, no fake data" },
    ]
  },
  {
    date: "May 30, 2026",
    items: [
      { type: "feat", text: "Public founder profile page — /profile/[username]" },
      { type: "feat", text: "Dashboard — edit profile, username, current project, progress" },
      { type: "feat", text: "Google Search Console verification" },
      { type: "fix", text: "Auth callback handler — auto-create profile on signup" },
    ]
  },
  {
    date: "May 29, 2026",
    items: [
      { type: "feat", text: "Supabase auth — Login/Register + Magic Link" },
      { type: "feat", text: "Dashboard page — profile + projects list" },
      { type: "feat", text: "Save projects to Supabase cloud" },
      { type: "feat", text: "Daily Check-in — 3 questions + AI nudge" },
    ]
  },
  {
    date: "May 28, 2026",
    items: [
      { type: "feat", text: "Foundertion launched — foundertion.vercel.app" },
      { type: "feat", text: "4 AI tools — Idea Validator, Business Plan, Pitch Script, Landing Copy" },
      { type: "feat", text: "20+ language auto-detection" },
      { type: "feat", text: "Export PDF — styled with Foundertion branding" },
      { type: "feat", text: "Waitlist — email signup with Resend" },
      { type: "feat", text: "Vercel Analytics + Groq API (Llama 3.3 70B)" },
    ]
  },
];

const TYPE_STYLE: Record<string, { bg: string; color: string }> = {
  feat: { bg: "#3fcf8e15", color: "#3fcf8e" },
  fix: { bg: "#f59e0b15", color: "#f59e0b" },
  improve: { bg: "#60a5fa15", color: "#60a5fa" },
};

export default function ChangelogPage() {
  return (
    <div style={{minHeight:"100vh",background:"#0b1a12",color:"#e8ede9",fontFamily:"'DM Sans',sans-serif"}}>
      <header style={{borderBottom:"1px solid #1e3d2a",padding:"1rem 1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#0b1a12",position:"sticky",top:0,zIndex:50}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:"0.6rem",textDecoration:"none"}}>
          <img src="/android-chrome-192.png" alt="Foundertion" style={{height:"28px",width:"28px",borderRadius:"8px"}} />
          <span style={{fontWeight:700,fontSize:"1rem",color:"#3fcf8e"}}>Foundertion</span>
        </a>
        <a href="/" style={{fontSize:"0.75rem",color:"#3fcf8e",textDecoration:"none"}}>Try AI Tool →</a>
      </header>

      <main style={{maxWidth:"640px",margin:"0 auto",padding:"2.5rem 1.5rem"}}>
        <div style={{marginBottom:"2.5rem"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",background:"#3fcf8e15",border:"1px solid #3fcf8e30",borderRadius:"20px",padding:"0.3rem 0.9rem",marginBottom:"1rem"}}>
            <span style={{width:"6px",height:"6px",borderRadius:"50%",background:"#3fcf8e",display:"inline-block"}} />
            <span style={{fontSize:"0.65rem",color:"#3fcf8e",letterSpacing:"0.12em",fontWeight:700}}>BUILDING IN PUBLIC</span>
          </div>
          <h1 style={{fontSize:"2rem",fontWeight:900,marginBottom:"0.5rem"}}>Changelog</h1>
          <p style={{color:"#4a7060",fontSize:"0.85rem",lineHeight:1.6}}>Every feature, fix, and improvement — logged publicly.</p>
        </div>

        <div style={{position:"relative"}}>
          <div style={{position:"absolute",left:"0",top:"8px",bottom:"0",width:"2px",background:"linear-gradient(180deg,#3fcf8e,#1e3d2a)",borderRadius:"1px"}} />
          <div style={{display:"flex",flexDirection:"column",gap:"2rem",paddingLeft:"1.5rem"}}>
            {CHANGELOG.map((entry, i) => (
              <div key={i} style={{position:"relative"}}>
                <div style={{position:"absolute",left:"-1.9rem",top:"0.3rem",width:"10px",height:"10px",borderRadius:"50%",background:i===0?"#3fcf8e":"#1e3d2a",border:`2px solid ${i===0?"#3fcf8e":"#2a3d32"}`}} />
                <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.8rem"}}>
                  <span style={{fontSize:"0.8rem",fontWeight:700,color:i===0?"#3fcf8e":"#e8ede9"}}>{entry.date}</span>
                  {i===0 && <span style={{fontSize:"0.6rem",background:"#3fcf8e20",color:"#3fcf8e",padding:"0.1rem 0.4rem",borderRadius:"4px",fontWeight:700}}>LATEST</span>}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                  {entry.items.map((item, j) => {
                    const s = TYPE_STYLE[item.type] || TYPE_STYLE.feat;
                    return (
                      <div key={j} style={{display:"flex",alignItems:"flex-start",gap:"0.6rem",padding:"0.6rem 0.8rem",background:"#0f2118",borderRadius:"8px",border:"1px solid #1e3d2a"}}>
                        <span style={{fontSize:"0.6rem",background:s.bg,color:s.color,padding:"0.15rem 0.4rem",borderRadius:"4px",fontWeight:700,flexShrink:0,marginTop:"0.1rem"}}>{item.type}</span>
                        <span style={{fontSize:"0.82rem",color:"#90b8a0",lineHeight:1.5}}>{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{textAlign:"center",marginTop:"3rem",padding:"1.5rem",background:"#0f2118",border:"1px solid #1e3d2a",borderRadius:"16px"}}>
          <p style={{fontSize:"0.82rem",color:"#4a7060",marginBottom:"0.8rem"}}>Want to follow the journey?</p>
          <div style={{display:"flex",gap:"0.7rem",justifyContent:"center",flexWrap:"wrap"}}>
            <a href="https://discord.gg/fxUEHJgg8" target="_blank" rel="noopener noreferrer"
              style={{background:"#3fcf8e",color:"#0b1a12",padding:"0.6rem 1.2rem",borderRadius:"8px",textDecoration:"none",fontWeight:700,fontSize:"0.8rem"}}>
              Join Discord →
            </a>
            <a href="/#waitlist" style={{background:"transparent",color:"#3fcf8e",padding:"0.6rem 1.2rem",borderRadius:"8px",textDecoration:"none",fontWeight:700,fontSize:"0.8rem",border:"1px solid #3fcf8e40"}}>
              Join Waitlist →
            </a>
          </div>
        </div>
      </main>

      <footer style={{textAlign:"center",padding:"2rem",fontSize:"0.72rem",color:"#2a3d32",borderTop:"1px solid #1e3d2a",marginTop:"2rem"}}>
        Foundertion · Building in public since May 2026
      </footer>
    </div>
  );
}
