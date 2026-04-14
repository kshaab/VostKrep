import HomePage from "@/components/pages/HomePage";
import CategoriesSectionClient from "@/components/categories/CategoriesSectionClient";
import CategoriesSectionSSR from "@/components/categories/CategoriesSectionSSR";
import { Category } from "@/types/category";
import { endpoints } from "@/lib/api";
import type { Metadata } from "next";

async function getHomePage() {
  try {
    const res = await fetch(endpoints.static_pages("home"), {
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error("Home fetch error:", e);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage();

  if (!page) {
    return {
      title: "ВостКреп",
      description: "Крепеж, болты, гайки, анкеры",
    };
  }

  return {
    title: page.title,
    description: page.seo_description,
    openGraph: {
      title: page.title,
      description: page.seo_description,
    },
  };
}

export default async function Home() {
  let categories: Category[] = [];

  try {
    categories = await CategoriesSectionSSR();
  } catch (error) {
    console.error("SSR fetch failed:", error);
  }

  return (
    <main>
      <HomePage />
      <CategoriesSectionClient categories={categories} />
    </main>
  );
}