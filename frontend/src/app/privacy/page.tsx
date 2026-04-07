import PrivacyPolicy from "@/components/pages/Privacy";
import { endpoints } from "@/lib/api";
import type { Metadata } from "next";
import ScrollToTopButton from "@/components/icons/ScrollToTopButton";

async function getPrivacyPage() {
  try {
    const res = await fetch(endpoints.static_pages("privacy"), { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}


export async function generateMetadata(): Promise<Metadata> {
  const page = await getPrivacyPage();
  if (!page) return {};

  return {
    title: page.seo_title || page.title,
    description: page.seo_description || "",
    robots: { index: true, follow: true },
    openGraph: {
      title: page.seo_title || page.title,
      description: page.seo_description || "",
      images: [], // картинок нет
    },
  };
}

export default function PrivacyPage() {
  return (
    <main>
      <div
        id="personal-data-container"
        style={{ backgroundColor: "#F2F3F4", position: "relative" }}
      >
        <PrivacyPolicy />
        <ScrollToTopButton />
      </div>
    </main>
  );
}