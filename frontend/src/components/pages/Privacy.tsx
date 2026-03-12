"use client";
import { useEffect, useState } from "react";
import { StaticPage } from "@/types/static_pages";
import { endpoints } from "@/lib/api";

export default function PrivacyPolicy() {
  const [page, setPage] = useState<StaticPage | null>(null);

  useEffect(() => {
    fetch(endpoints.static_pages("privacy"))
      .then(res => res.json())
      .then(data => setPage(data));
  }, []);

  if (!page) {
    return (
      <div className="bg-[#F2F3F4] min-h-screen flex items-center justify-center">
        <p className="text-[#003399] text-3xl font-bold font-sans animate-pulse">
          Загрузка…
        </p>
      </div>
    );
  }

  // Функция для разбивки текста на строки и определения уровня пункта
  const renderTextWithSubpoints = (text: string) => {
    return text.split("\n").map((line, idx) => {
      line = line.trim();
      if (!line) return null;

      // Проверяем уровень пункта по шаблону 1.1, 2.3, 3.2 и т.д.
      const isSubPoint = /^\d+\.\d+\./.test(line);
      const isMainPoint = /^\d+\./.test(line) && !isSubPoint;

      if (isMainPoint) {
        return (
          <p key={idx} className="font-semibold text-lg mt-4 font-sans">
            {line}
          </p>
        );
      } else if (isSubPoint) {
        return (
          <p key={idx} className="ml-6 text-[#003399] leading-relaxed font-sans">
            {line}
          </p>
        );
      } else {
        return (
          <p key={idx} className="ml-8 text-[#003399] leading-relaxed mt-1 font-sans">
            {line}
          </p>
        );
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F2F3F4] text-[#003399] px-6 py-12 md:px-20 lg:px-40 overflow-y-auto font-sans">
      <h1 className="font-heading text-5xl md:text-6xl leading-none tracking-[0.04em] font-bold">
          {page.title}
      </h1>

      {page.sections.map(section => (
        <div key={section.id} className="mb-10 mt-10 text-xl">

          {section.subtitle && (
            <p className="mb-4 text-[#003399] leading-relaxed font-sans">{section.subtitle}</p>
          )}

          {section.items?.map(item => (
            <div key={item.id} className="mb-6">
              <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
              {renderTextWithSubpoints(item.text)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}