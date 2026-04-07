import AboutPage from "@/components/pages/About";
import type { Metadata } from "next";
import { endpoints } from "@/lib/api";
import { StaticPage } from "@/types/static_pages";

async function getAboutSEO(): Promise<Metadata> {
  const res = await fetch(endpoints.static_pages("about"), { cache: "no-store" });
  const data: StaticPage = await res.json();

  return {
    title: data.seo_title || data.title,
    description: data.seo_description || "",
    openGraph: {
      title: data.seo_title || data.title,
      description: data.seo_description || "",
      images: ["/logo-dark2.png"],
    },
    robots: { index: true, follow: true },
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return await getAboutSEO();
}

export default function About() {
  return (
    <main>
      <AboutPage />
    </main>
  );
}