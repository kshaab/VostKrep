"use client";
import { useEffect, useState } from "react";
import { StaticPage } from "@/types/static_pages";
import { endpoints } from "@/lib/api";
import NutIcon from "@/components/icons/NutIcon";

export default function PersonalData() {
  const [page, setPage] = useState<StaticPage | null>(null);

  useEffect(() => {
    fetch(endpoints.static_pages("personal-data"))
      .then((res) => res.json())
      .then((data) => setPage(data));
  }, []);

  if (!page) {
    return (
      <div className="bg-[#F2F3F4] min-h-screen flex items-center justify-center">
        <p className="text-[#003399] text-3xl font-sans animate-pulse">
          Загрузка…
        </p>
      </div>
    );
  }

  const renderTextWithSubpoints = (text: string) => {
    return text.split("\n").map((line, idx) => {
      line = line.trim();
      if (!line) return null;

      // Булет-лист с NutIcon
      if (line.startsWith("* ")) {
        return (
          <div key={idx} className="flex items-start gap-3 ml-10 mt-2">
            <NutIcon />
            <p className="text-lg md:text-2xl leading-relaxed text-[#003399] font-sans">
              {line.slice(2)}
            </p>
          </div>
        );
      }

      // Подпункт формата 1.1, 2.3 и т.д.
      const isSubPoint = /^\d+\.\d+/.test(line);
      // Главный пункт 1, 2, 3
      const isMainPoint = /^\d+\./.test(line) && !isSubPoint;

      if (isMainPoint) {
        return (
          <p
            key={idx}
            className="text-xl md:text-2xl mt-6 font-sans text-[#003399]"
          >
            {line}
          </p>
        );
      } else if (isSubPoint) {
        return (
          <p
            key={idx}
            className="ml-6 text-[#003399] leading-relaxed text-lg md:text-xl mt-2 font-sans"
          >
            {line}
          </p>
        );
      } else {
        return (
          <p
            key={idx}
            className="ml-8 text-[#003399] leading-relaxed text-base md:text-lg mt-1 font-sans"
          >
            {line}
          </p>
        );
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F2F3F4] text-[#003399] px-6 py-12 md:px-20 lg:px-40 overflow-y-auto font-sans">
      <h1 className="font-heading text-5xl md:text-6xl leading-none tracking-[0.04em] mb-10 font-bold">
        {page.title}
      </h1>

      {page.sections.map((section) => (
        <div key={section.id} className="mb-10">
          {section.items?.map((item) => (
            <div key={item.id} className="mb-6">
              {renderTextWithSubpoints(item.text)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}