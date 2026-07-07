import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Links",
  description: "All the ways to try Foundertion, join the community, and follow the build-in-public journey.",
};

export default function LinksPage() {
  const links = [
    { emoji: "🚀", label: "Try Foundertion — Free AI Tools", url: "/", primary: true },
    { emoji: "💬", label: "Join Discord Community", url: "https://discord.gg/fxUEHJgg8", primary: false },
    { emoji: "📧", label: "Join Weekly Newsletter", url: "/#waitlist", primary: false },
    { emoji: "🐦", label: "Follow on X/Twitter", url: "https://x.com/foundertion", primary: false },
    { emoji: "📸", label: "Follow on Instagram", url: "https://instagram.com/foundertion", primary: false },
  ];

  return (
    <div style={{minHeight:"100vh",background:"#0b1a12",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"1.5rem",fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{width:"100%",maxWidth:"360px"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <img src="/android-chrome-192.png" alt="Foundertion" style={{height:"80px",width:"80px",borderRadius:"20px",margin:"0 auto 1rem"}} />
          <h1 style={{fontSize:"1.5rem",fontWeight:700,color:"#e8ede9",margin:"0 0 0.3rem"}}>Foundertion</h1>
          <p style={{fontSize:"0.8rem",color:"#4a7060",margin:0}}>Stop guessing. Start shipping.</p>
          <p style={{fontSize:"0.72rem",color:"#2a9e6a",marginTop:"0.4rem"}}>Build alone, never ship alone. 🚀</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"0.7rem"}}>
          {links.map((link, i) => (
            <a key={i} href={link.url}
              style={{display:"flex",alignItems:"center",gap:"0.8rem",padding:"0.85rem 1.2rem",borderRadius:"14px",textDecoration:"none",fontWeight:600,fontSize:"0.88rem",background:link.primary?"#3fcf8e":"#0f2118",color:link.primary?"#0b1a12":"#e8ede9",border:link.primary?"none":"1px solid #1e3d2a",transition:"all 0.2s"}}>
              <span>{link.emoji}</span>
              <span>{link.label}</span>
            </a>
          ))}
        </div>
        <p style={{textAlign:"center",fontSize:"0.65rem",color:"#2a3d32",marginTop:"2rem"}}>
          © 2026 Foundertion · Made by a solo founder, for solo founders
        </p>
      </div>
    </div>
  );
}
