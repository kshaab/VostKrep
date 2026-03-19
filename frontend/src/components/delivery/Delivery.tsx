"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DeliveryPage} from "@/types/delivery";
import { useParams } from "next/navigation"
import {endpoints} from "@/lib/api";
import NutIcon from "@/components/icons/NutIcon";

export default function Delivery() {

  const [delivery, setDelivery] = useState<DeliveryPage | null>(null);
  const params = useParams()
  const slug = params.slug

  useEffect(() => {
    fetch(endpoints.delivery)
      .then(res => res.json())
      .then(data => setDelivery(data));
  }, []);

  if (!delivery) {
    return (
      <div className="text-[#F2F3F4] bg-[#003399] min-h-screen flex items-center justify-center font-heading text-2xl">
        Загрузка...
      </div>
    );
  }

  const leftItems = delivery.items.slice(0, 3);
  const rightItems = delivery.items.slice(3);

  return (
    <div className="bg-[#003399] text-[#F2F3F4] min-h-screen flex flex-col gap-12">

      <div className="mx-auto max-w-6xl w-full">

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

              <ul className="font-sans text-xl leading-relaxed font-semibold space-y-6">
                {leftItems.map(item => (
                  <li key={item.id} className="flex items-start gap-2">
                    <NutIcon />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-2 gap-6">
                <Image
                  src="/delivery_icons/ya-del.png"
                  alt="delovie-linii"
                  width={300}
                  height={200}
                  className="h-auto rounded-lg translate-y-[-40px] w-60 translate-x-[70px]"
                />
                <Image
                  src="/delivery_icons/del-lin.png"
                  alt="baikal"
                  width={300}
                  height={200}
                  className="h-auto rounded-lg translate-y-[-40px] w-60 translate-x-[40px]"
                />
              </div>

            </div>

            {/* Правая колонка */}
            <div className="flex flex-col gap-8">

              <ul className="font-sans text-xl leading-relaxed font-semibold space-y-6">
                {rightItems.map(item => (
                  <li key={item.id} className="flex items-start gap-2">
                    <NutIcon />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-2 gap-6">
                <Image
                  src="/delivery_icons/zing-log.png"
                  alt="zinger"
                  width={300}
                  height={150}
                  className="h-auto rounded-lg translate-y-[-20px] translate-x-[-40px] w-60"
                />
                <Image
                  src="/delivery_icons/baikal-serv.png"
                  alt="yandex-delivery"
                  width={300}
                  height={150}
                  className="h-auto rounded-lg translate-y-[-20px] translate-x-[-70px] w-60"
                />
              </div>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}