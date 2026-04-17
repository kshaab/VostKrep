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

  const title = page?.title || "Крепёж оптом — Восточный Крепёж";

  return {
    title: {
      default: "Крепёж оптом — Восточный Крепёж",
      template: "%s | Восточный Крепёж",
    },

    description:
      page?.seo_description ||
      "Восточный Крепёж — поставщик крепежа оптом: болты, гайки, анкеры, шайбы. Наличие на складе, выгодные цены, доставка по всей России.",

    alternates: {
      canonical: "https://vostkrep.ru",
    },

    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description:
        "Оптовые поставки крепежа: болты, гайки, анкеры и метизы. Восточный Крепёж — надёжный поставщик с доставкой по России.",
      url: "https://vostkrep.ru",
      siteName: "Восточный Крепёж",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description:
        "Крепёж: болты, гайки, анкеры. Оптовые поставки по России.",
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