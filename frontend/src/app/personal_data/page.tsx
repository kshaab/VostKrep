import PersonalData from "@/components/pages/PersonalData";
import { endpoints } from "@/lib/api";
import type { Metadata } from "next";
import ScrollToTopButton from "@/components/icons/ScrollToTopButton";


async function getPageData() {
  try {
    const res = await fetch(endpoints.static_pages("personal-data"), { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}


export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageData();
  if (!page) return {};
  return {
    title: page.title,
    description: page.seo_description || "",
    robots: {
      index: true,
      follow: true,
    },
  };
}


export default function PersonalDataPage() {
  return (
    <main>
      <div
        id="personal-data-container"
        style={{ backgroundColor: "#F2F3F4", position: "relative" }}
      >
        <PersonalData />
        <ScrollToTopButton />
      </div>
    </main>
  );
}