"use client";

import React, { useEffect, useState } from "react";
import { endpoints } from "@/lib/api";
import {
  StaticPage,
  StaticPageSection,
  StaticPageItem,
} from "@/types/static_pages";
import NutIcon from "@/components/icons/NutIcon";
import {useModal} from "@/context/FormContext";

export default function Payment() {
  const [page, setPage] = useState<StaticPage | null>(null);
    const { openModal } = useModal();

  const textFromAdmin = `После оформления заказа:
Менеджер подтверждает наличие товара
Формируется счет и согласовываются условия доставки
Заказ комплектуется на складе
Осуществляется доставка или подготовка к самовывозу`;

const lines = textFromAdmin.split('\n');

  useEffect(() => {
    fetch(endpoints.static_pages("payment"))
      .then((res) => res.json())
      .then((data: StaticPage) =>
        setPage({
          ...data,
          sections: data.sections ?? [],
        })
      );
  }, []);

  if (!page) {
    return (
      <div className="text-[#003399] bg-[#F2F3F4] min-h-screen flex items-center justify-center font-heading text-2xl">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="bg-[#F2F3F4] text-[#003399] py-6">
  <div className="mx-auto max-w-6xl flex flex-col pb-20">
    {/* Главный заголовок */}
    <section className="py-10">
      <h1 className="font-heading text-5xl md:text-6xl leading-none tracking-[0.04em] font-bold">
        {page.title}
      </h1>
    </section>

    {/* Секции */}
    {page.sections.map((section: StaticPageSection, index) => (
      <div key={section.id ?? index} className="flex flex-col gap-4">
        <h2 className="font-heading text-4xl md:text-5xl leading-none tracking-[0.04em] font-bold text-[#F0660A]">
          {section.title}
        </h2>

        {section.subtitle && (
          <p className="text-[#003399]">{section.subtitle}</p>
        )}

        <ul className="flex flex-col gap-6 text-2xl leading-relaxed mt-8 font-sans">
  {section.items?.map((item: StaticPageItem, idx) => (
    <li key={item.id ?? idx} className="flex items-start gap-4 ">
      <NutIcon />

      <div>
        <h3 className="font-semibold text-3xl font-sans text-[#003399]">{item.title}</h3>
                {idx === 2 ? (
                  <ul className="font-sans list-decimal text-2xl list-inside space-y-2 text-[#003399] mt-2">
                    {lines.slice(1).map((line, liIdx) => (
                      <li key={liIdx}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#003399] text-2xl py-4 leading-relaxed">{item.text}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
  <section className="bg-[#F2F3F4] py-14">
        <div className="max-w-4xl mx-auto px-6 tracking-[0.04em]">
          <button
            onClick={openModal}
            className="w-full
            bg-[#003399]
            text-[#F2F3F4]
            py-4 text-3xl font-heading font-semibold
            hover:bg-[#F0660A] hover:text-[#003399]
            transition-colors"
          >
            Запросить счёт на крепеж
          </button>
        </div>
      </section>
</div>
  );
}
