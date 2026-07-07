import type { MetadataRoute } from "next";
import { createServerClient } from "@supabase/ssr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: "https://foundertion.vercel.app/", changeFrequency: "weekly", priority: 1 },
    { url: "https://foundertion.vercel.app/changelog", changeFrequency: "weekly", priority: 0.6 },
    { url: "https://foundertion.vercel.app/links", changeFrequency: "monthly", priority: 0.4 },
  ];

  // Include public founder profiles so the community itself becomes discoverable.
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    );

    const { data: profiles } = await supabase
      .from("profiles")
      .select("username, created_at")
      .eq("is_public", true);

    const profileRoutes: MetadataRoute.Sitemap = (profiles || []).map((p) => ({
      url: `https://foundertion.vercel.app/profile/${p.username}`,
      lastModified: p.created_at ? new Date(p.created_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.5,
    }));

    return [...staticRoutes, ...profileRoutes];
  } catch {
    // If Supabase is unreachable at build time, still ship the static sitemap
    // rather than failing the whole build.
    return staticRoutes;
  }
}
