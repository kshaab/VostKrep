"use client"

import { useState } from "react";
import Image from "next/image";

export default function Categories() {

  const categories = [
    { name: "Болты", image: "/categories/bolt2.png" },
    { name: "Саморезы", image: "/categories/screw2.png" },
    { name: "Шурупы", image: "/categories/shurup2.png" },
    { name: "Шпильки", image: "/categories/stud.png" },
    { name: "Перфорация", image: "/categories/perf.png" },
    { name: "Шайбы", image: "/categories/washer.png" },
    { name: "Гайки", image: "/categories/nut.png" },
    { name: "Анкеры", image: "/categories/anchor.png" },
    { name: "Анкеры", image: "/categories/anchor.png" },
    { name: "Анкеры", image: "/categories/anchor.png" },
    { name: "Анкеры", image: "/categories/anchor.png" },
  ];

  const [expanded, setExpanded] = useState(false);

  return (
    <section className="font-sans bg-[#F2F3F4] text-[#003399] py-20">
      <div className="max-w-6xl mx-auto px-6 py-6">

        {/*  ДЛЯ ГРАДИЕНТА */}
        <div className="relative">

          {/* КОНТЕЙНЕР С ОГРАНИЧЕНИЕМ (РАЗВЕРТЫВАНИЕ) */}
          <div
            className={`
              overflow-hidden
              transition-all
              duration-700
              ${expanded ? "max-h-[2000px]" : "max-h-[700px]"}
            `}
          >
            {/* СЕТКА КАРТОЧЕК */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-9">

              {categories.map((item, index) => (
                <div
                  key={index}
                   className="bg-white shadow-md cursor-pointer hover:border-2 hover:border-[#F0660A] transition-all"
                >
                  {/* НАЗВАНИЕ */}
                  <div className="px-4 py-3 font-semibold md:text-xl">
                    {item.name}
                  </div>

                  {/* КАРТИНКА */}
                  <div className="relative h-[180px] w-full">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* ГРАДИЕНТ  */}
          {!expanded && (
            <div className="
              absolute
              bottom-0
              left-0
              w-full
              h-32
              bg-gradient-to-t
              from-[#F2F3F4]
              via-[#F2F3F4]/80
              to-transparent
              pointer-events-none
            " />
          )}

        </div>

        {/* КНОПКА */}
        <div className="max-w-4xl mx-auto py-14 px-6 tracking-[0.04em]">
          <button
            onClick={() => setExpanded(!expanded)}
            className="
              w-full
            bg-[#003399]
            text-[#F2F3F4]
            py-4
            text-3xl
            font-heading
            font-semibold
            hover:bg-[#F0660A]
            hover:text-[#003399]
            transition-colors
            duration-300
            "
          >
            {expanded ? "СВЕРНУТЬ" : "ПОКАЗАТЬ ЕЩЁ"}
          </button>
        </div>

      </div>
    </section>
  );
}