import { Map } from "@/components/delivery/Map";
import Delivery from "@/components/delivery/Delivery";
import type { Metadata } from "next";
import { endpoints } from "@/lib/api";

async function getDeliveryPage() {
  const res = await fetch(endpoints.delivery, { cache: "no-store" });
  if (!res.ok) return null;
  return await res.json();
}

export async function generateMetadata(): Promise<Metadata> {
  const delivery = await getDeliveryPage();
  if (!delivery) return { title: "Доставка" };

  return {
    title: delivery.seo_title || delivery.title,
    description: delivery.seo_description || delivery.content,
    openGraph: {
      title: delivery.seo_title || delivery.title,
      description: delivery.seo_description || delivery.content,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}


export default async function Page() {
  const delivery = await getDeliveryPage();
  if (!delivery) return <div>Страница не найдена</div>;

  return (
    <main>
      <Delivery delivery={delivery} />
      <Map />
    </main>
  );
}