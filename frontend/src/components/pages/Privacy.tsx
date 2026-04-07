"use client";
import { useEffect, useState } from "react";
import { StaticPage } from "@/types/static_pages";
import { endpoints } from "@/lib/api";
import styles from "@/styles/privacy.module.css";

export default function PrivacyPolicy() {
  const [page, setPage] = useState<StaticPage | null>(null);

  useEffect(() => {
    fetch(endpoints.static_pages("privacy"))
      .then(res => res.json())
      .then(data => setPage(data));
  }, []);

  if (!page) {
    return (
      <div className={styles.loaderWrapper}>
        <p className={styles.loaderText}>Загрузка…</p>
      </div>
    );
  }

  const renderTextWithSubpoints = (text: string, parentKey: string) => {
    return text.split("\n").map((line, idx) => {
      line = line.trim();
      if (!line) return null;

      const isSubPoint = /^\d+\.\d+\./.test(line);
      const isMainPoint = /^\d+\./.test(line) && !isSubPoint;

      const key = `${parentKey}-line-${idx}`;

      if (isMainPoint) {
        return (
          <p key={key} className={styles.mainPoint}>
            {line}
          </p>
        );
      } else if (isSubPoint) {
        return (
          <p key={key} className={styles.subPoint}>
            {line}
          </p>
        );
      } else {
        return (
          <p key={key} className={styles.text}>
            {line}
          </p>
        );
      }
    });
  };

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>{page.title}</h1>

      {page.sections.map((section, sIdx) => (
        <div key={`section-${section.id ?? sIdx}`} className={styles.section}>
          {section.subtitle && (
            <p className={styles.subtitle}>{section.subtitle}</p>
          )}

          {section.items?.map((item, iIdx) => (
            <div key={`item-${item.id ?? iIdx}-${sIdx}`}>
              <h3 className={styles.itemTitle}>{item.title}</h3>
              {renderTextWithSubpoints(item.text, `section-${sIdx}-item-${iIdx}`)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}