import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, bio")
    .eq("username", params.username)
    .eq("is_public", true)
    .single();

  if (!profile) return { title: "Profile not found" };

  const displayName = profile.full_name || profile.username;
  return {
    title: `${displayName} (@${profile.username})`,
    description: profile.bio || `${displayName}'s founder profile on Foundertion — building in public.`,
    openGraph: {
      title: `${displayName} on Foundertion`,
      description: profile.bio || `Follow ${displayName}'s founder journey.`,
      type: "profile",
    },
  };
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", params.username)
    .eq("is_public", true)
    .single();

  if (!profile) notFound();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, idea, language, created_at")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const progress = profile.progress || 0;
  const progressColor = progress >= 85 ? "#3fcf8e" : progress >= 70 ? "#f59e0b" : "#3fcf8e";

  return (
    <div className="min-h-screen bg-[#0b1a12] text-[#e8ede9]" style={{fontFamily:"'DM Sans',sans-serif"}}>
      {/* Header */}
      <header style={{borderBottom:"1px solid #1e3d2a",padding:"1rem 1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#0b1a12ee",backdropFilter:"blur(14px)"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:"0.6rem",textDecoration:"none"}}>
          <img src="/android-chrome-192.png" alt="Foundertion" style={{height:"28px",width:"28px",borderRadius:"8px"}} />
          <span style={{fontWeight:700,fontSize:"1rem",color:"#3fcf8e"}}>Foundertion</span>
        </a>
        <a href="/dashboard" style={{fontSize:"0.75rem",color:"#4a7060",textDecoration:"none"}}>Dashboard →</a>
      </header>

      <main style={{maxWidth:"600px",margin:"0 auto",padding:"2.5rem 1.5rem"}}>

        {/* Profile Card */}
        <div style={{background:"#0f2118",border:"1px solid #1e3d2a",borderRadius:"16px",padding:"1.8rem",marginBottom:"1.5rem",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:"3px",background:`linear-gradient(90deg,#3fcf8e,#2a9e6a)`}} />

          <div style={{display:"flex",alignItems:"flex-start",gap:"1.2rem"}}>
            <div style={{height:"64px",width:"64px",borderRadius:"50%",background:"#3fcf8e20",border:"2px solid #3fcf8e40",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.6rem",fontWeight:700,color:"#3fcf8e",flexShrink:0}}>
              {(profile.full_name || profile.email)?.[0]?.toUpperCase() || "F"}
            </div>
            <div style={{flex:1}}>
              <h1 style={{fontSize:"1.3rem",fontWeight:700,margin:"0 0 0.2rem",color:"#e8ede9"}}>
                {profile.full_name || profile.username}
              </h1>
              <p style={{fontSize:"0.78rem",color:"#4a7060",margin:"0 0 0.5rem"}}>@{profile.username}</p>
              {profile.bio && <p style={{fontSize:"0.85rem",color:"#90b8a0",lineHeight:1.6,margin:"0 0 0.8rem"}}>{profile.bio}</p>}
              <div style={{display:"flex",gap:"0.8rem",flexWrap:"wrap"}}>
                {profile.twitter && (
                  <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer"
                    style={{fontSize:"0.72rem",color:"#3fcf8e",textDecoration:"none"}}>
                    𝕏 @{profile.twitter}
                  </a>
                )}
                <span style={{fontSize:"0.72rem",color:"#2a3d32"}}>
                  Joined {new Date(profile.created_at).toLocaleDateString("en-GB",{month:"long",year:"numeric"})}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Build */}
        {profile.current_project && (
          <div style={{background:"#0f2118",border:"1px solid #3fcf8e30",borderRadius:"16px",padding:"1.5rem",marginBottom:"1.5rem"}}>
            <p style={{fontSize:"0.65rem",color:"#4a7060",letterSpacing:"0.1em",marginBottom:"0.6rem",fontWeight:700}}>CURRENTLY BUILDING</p>
            <p style={{fontSize:"0.95rem",color:"#e8ede9",marginBottom:"1.2rem",lineHeight:1.6}}>{profile.current_project}</p>

            {/* Progress bar */}
            <div style={{marginBottom:"0.5rem"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"0.35rem"}}>
                <span style={{fontSize:"0.72rem",color:"#4a7060"}}>Progress</span>
                <span style={{fontSize:"0.72rem",fontWeight:700,color:progressColor}}>{progress}%</span>
              </div>
              <div style={{height:"8px",background:"#1e3d2a",borderRadius:"4px",overflow:"hidden"}}>
                <div style={{height:"100%",width:`${progress}%`,background:`linear-gradient(90deg,${progressColor},${progressColor}aa)`,borderRadius:"4px",transition:"width 0.5s ease"}} />
              </div>
              {progress >= 70 && progress < 100 && (
                <p style={{fontSize:"0.7rem",color:"#f59e0b",marginTop:"0.4rem",fontWeight:600}}>
                  🚨 In the 70-85% zone — don't quit now!
                </p>
              )}
              {progress === 100 && (
                <p style={{fontSize:"0.7rem",color:"#3fcf8e",marginTop:"0.4rem",fontWeight:600}}>
                  🚀 Shipped!
                </p>
              )}
            </div>

            {profile.project_url && (
              <a href={profile.project_url} target="_blank" rel="noopener noreferrer"
                style={{display:"inline-flex",alignItems:"center",gap:"0.4rem",marginTop:"0.8rem",fontSize:"0.78rem",color:"#3fcf8e",textDecoration:"none",background:"#3fcf8e15",border:"1px solid #3fcf8e30",padding:"0.4rem 0.8rem",borderRadius:"8px"}}>
                🔗 View Project
              </a>
            )}
          </div>
        )}

        {/* Recent Research */}
        {projects && projects.length > 0 && (
          <div style={{background:"#0f2118",border:"1px solid #1e3d2a",borderRadius:"16px",padding:"1.5rem",marginBottom:"1.5rem"}}>
            <p style={{fontSize:"0.65rem",color:"#4a7060",letterSpacing:"0.1em",marginBottom:"1rem",fontWeight:700}}>RECENT RESEARCH</p>
            <div style={{display:"flex",flexDirection:"column",gap:"0.7rem"}}>
              {projects.map((p: any) => (
                <div key={p.id} style={{padding:"0.75rem",background:"#0b1a12",borderRadius:"10px",border:"1px solid #1e3d2a"}}>
                  <p style={{fontSize:"0.82rem",color:"#90b8a0",lineHeight:1.5,margin:"0 0 0.3rem"}}>{p.idea?.slice(0, 80)}{p.idea?.length > 80 ? "..." : ""}</p>
                  <p style={{fontSize:"0.65rem",color:"#2a3d32",margin:0}}>{new Date(p.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{textAlign:"center",padding:"1.5rem",background:"#0f2118",border:"1px solid #1e3d2a",borderRadius:"16px"}}>
          <p style={{fontSize:"0.85rem",color:"#4a7060",marginBottom:"1rem"}}>Building solo? Join the community.</p>
          <a href="/" style={{display:"inline-block",background:"#3fcf8e",color:"#0b1a12",padding:"0.7rem 1.5rem",borderRadius:"10px",textDecoration:"none",fontWeight:700,fontSize:"0.85rem"}}>
            Try Foundertion Free →
          </a>
        </div>
      </main>

      <footer style={{textAlign:"center",padding:"2rem",fontSize:"0.72rem",color:"#2a3d32",borderTop:"1px solid #1e3d2a",marginTop:"2rem"}}>
        Foundertion · AI-Native Founder Community · foundertion.vercel.app
      </footer>
    </div>
  );
}
