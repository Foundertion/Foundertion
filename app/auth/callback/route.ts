import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  
  console.log("Callback hit, code:", code ? "exists" : "missing");

  if (code) {
    try {
      const { createServerClient } = await import("@supabase/ssr");
      const { cookies } = await import("next/headers");
      
      const cookieStore = await cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return cookieStore.getAll(); },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            },
          },
        }
      );

      const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);
      console.log("User:", user?.email, "Error:", error?.message);

      if (user) {
        const adminSupabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          { cookies: { getAll: () => [], setAll: () => {} } }
        );

        const { error: insertError } = await adminSupabase
          .from("profiles")
          .upsert({ id: user.id, email: user.email, created_at: new Date().toISOString() }, 
          { onConflict: "id" });
        
        console.log("Insert error:", insertError?.message || "none");
      }
    } catch (e) {
      console.error("Callback error:", e);
    }
  }

  return NextResponse.redirect(new URL("/?login=success", request.url));
}
