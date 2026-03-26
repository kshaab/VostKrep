"use client";

import React, { useEffect, useState } from "react";
import { endpoints } from "@/lib/api";
import NutIcon from "@/components/icons/NutIcon";
import styles from "@/styles/about.module.css";
import {
  StaticPage
} from "@/types/static_pages";

export default function AboutPage() {
  const [page, setPage] = useState<StaticPage | null>(null);

  useEffect(() => {
    fetch(endpoints.static_pages("about"))
      .then((res) => res.json())
      .then((data: StaticPage) =>
        setPage({
          ...data,
          sections: data.sections || [],
        })
      );
  }, []);

  if (!page) {
    return (
      <div className={styles.loaderWrapper}>
        <p className={styles.loaderText}>Загрузка…</p>
      </div>
    );
  }

  const contentItems = page.content
    ? page.content
        .split("•")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    : [];


  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Главный заголовок */}
        <section className={styles.titleSection}>
          <h1>{page.title}</h1>
        </section>

        {/* Секции страницы */}
        {page.sections.map((section, index) => {
          const isAdvantages = true;

          const leftItems = isAdvantages
              ? section.items.slice(0, Math.ceil(section.items.length / 2))
              : [];

            const rightItems = isAdvantages
              ? section.items.slice(Math.ceil(section.items.length / 2))
              : [];

          return (
            <section className={styles.whiteBlock} key={section.order ?? index}>
              {/* Подзаголовок секции */}
              {section.subtitle && (
                <h3 className={styles.sectionTitle}>{section.subtitle}</h3>
              )}
               {contentItems.length > 0 && (
                  <section>
                    <ul className={styles.introList}>
                      {contentItems.map((text, idx) => (
                        <li key={`content-${idx}`}>
                          <NutIcon />
                          <span>{text}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

              <div>
                  {/* Заголовок секции */}
                  {section.title && ( <h3 className={styles.sectionTitle}>
                          {section.title} </h3>
                  )}
              {/* Если это преимущества — 2 колонки */}
              {isAdvantages ? (
                <div className={styles.columnsGrid}>
                  <ul className={styles.itemList}>
                    {leftItems.map((item) => (
                       <li key={`left-${item.order}`}>
                        <NutIcon />
                        <div>
                          {item.title && <strong>{item.title}</strong>}
                          <span>{item.text}</span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <ul className={styles.itemList}>
                    {rightItems.map((item) => (
                      <li key={`right-${item.order}`}>
                        <NutIcon />
                        <div>
                          {item.title && <strong>{item.title}</strong>}
                          <span>{item.text}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <ul className={styles.introList}>
                  {section.items.map((item) => (
                    <li key={item.order}>
                      <NutIcon />
                      <div>
                        {item.title && <strong>{item.title}</strong>}
                        <span>{item.text}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}