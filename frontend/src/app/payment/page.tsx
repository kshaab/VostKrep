
import Payment from "@/components/pages/Payment";
import { endpoints } from "@/lib/api";
import type { Metadata } from "next";

async function getPaymentPage() {
  try {
    const res = await fetch(endpoints.static_pages("payment"), {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPaymentPage();
  if (!page) return {};

  return {
    title: page.title,
    description: page.seo_description, // описание из админки
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: page.title,
      description: page.seo_description,
    },
  };
}

export default async function PaymentPage() {
  return (
    <main>
      <Payment />
    </main>
  );
}