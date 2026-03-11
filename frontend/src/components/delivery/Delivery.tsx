"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DeliveryPage} from "@/types/delivery";
import { useParams } from "next/navigation"
import {endpoints} from "@/lib/api";


export default function Delivery() {

  const [delivery, setDelivery] = useState<DeliveryPage | null>(null);
  const params = useParams()
  const slug = params.slug

  useEffect(() => {
    fetch(endpoints.delivery)
      .then(res => res.json())
      .then(data => setDelivery(data));
  }, []);

  const NutIcon = () => (
    <svg width="28" height="28" viewBox="0 0 100 100" fill="none" className="mt-1 shrink-0">
      <polygon
        points="50,5 85,25 85,75 50,95 15,75 15,25"
        stroke="currentColor"
        strokeWidth="8"
        fill="none"
      />
      <circle
        cx="50"
        cy="50"
        r="18"
        stroke="currentColor"
        strokeWidth="8"
        fill="none"
      />
    </svg>
  );

  if (!delivery) {
    return (
      <div className="text-[#F2F3F4] bg-[#003399] min-h-screen flex items-center justify-center font-heading text-2xl">
        Загрузка...
      </div>
    );
  }

  const leftItems = delivery.items.slice(0, 2);
  const rightItems = delivery.items.slice(2);

  return (
    <div className="bg-[#003399] text-[#F2F3F4] min-h-screen flex flex-col gap-12">

      <div className="mx-auto max-w-6xl w-full px-8">

        {/* Заголовок */}
        <section className="pt-10">
          <h1 className="font-heading text-5xl md:text-7xl leading-none tracking-[0.04em] font-bold">
            {delivery.title}
          </h1>

          <p className="font-heading text-4xl leading-none tracking-[0.04em] font-bold pt-6">
            {delivery.content}
          </p>
        </section>

        {/* Белый блок */}
        <section className="bg-[#F2F3F4] text-[#003399] py-6 relative h-[550px] mt-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 px-10 py-8">

            {/* Левая колонка */}
            <div className="flex flex-col gap-5">

              <ul className="font-sans text-2xl leading-relaxed font-semibold space-y-6">
                {leftItems.map(item => (
                  <li key={item.id} className="flex items-start gap-2">
                    <NutIcon />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-2 gap-6">
                <Image
                  src="/delivery_icons/delovie-linii.png"
                  alt="delovie-linii"
                  width={300}
                  height={200}
                  className="h-auto rounded-lg translate-y-[45px] w-40"
                />
                <Image
                  src="/delivery_icons/baikal.png"
                  alt="baikal"
                  width={300}
                  height={200}
                  className="h-auto rounded-lg translate-y-[40px] w-40"
                />
              </div>

            </div>

            {/* Правая колонка */}
            <div className="flex flex-col gap-8">

              <ul className="font-sans text-2xl leading-relaxed font-semibold space-y-6">
                {rightItems.map(item => (
                  <li key={item.id} className="flex items-start gap-2">
                    <NutIcon />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-2 gap-6">
                <Image
                  src="/delivery_icons/zinger-log.png"
                  alt="zinger"
                  width={300}
                  height={150}
                  className="h-auto rounded-lg translate-y-[-10px] w-40"
                />
                <Image
                  src="/delivery_icons/yandex-delivery.png"
                  alt="yandex-delivery"
                  width={300}
                  height={150}
                  className="h-auto rounded-lg translate-y-[-10px] w-40"
                />
              </div>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}