"use client";

import React, { useEffect, useState } from "react";
import { StaticPage } from "@/types/static_pages";
import NutIcon from "@/components/icons/NutIcon";
import { useModal } from "@/context/FormContext";
import styles from "@/styles/payment.module.css";
import { endpoints } from "@/lib/api";

export default function Payment() {
  const textFromAdmin = `После оформления заказа:
Менеджер подтверждает наличие товара
Формируется счет и согласовываются условия доставки
Заказ комплектуется на складе
Осуществляется доставка или подготовка к самовывозу`;

  const [page, setPage] = useState<StaticPage | null>(null);
  const { openModal } = useModal();

  // Разбиваем текст на строки и убираем пустые
  const lines = textFromAdmin.split("\n").map(line => line.trim()).filter(Boolean);

  useEffect(() => {
    fetch(endpoints.static_pages("payment"))
      .then(res => res.json())
      .then((data: StaticPage) => setPage({ ...data, sections: data.sections ?? [] }));
  }, []);

  if (!page) return <div className={styles.loaderWrapper}><p className={styles.loaderText}>Загрузка…</p></div>;

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <section>
          <h1 className={styles.title}>{page.title}</h1>
        </section>

        {page.sections.map((section, sectionIdx) => (
          <div key={section.id ?? sectionIdx} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            {section.subtitle && <p className={styles.subtitle}>{section.subtitle}</p>}

            <div className={styles.grid}>
              <ul className={styles.list}>
                {section.items?.map((item, itemIdx) => (
                  <li key={`${sectionIdx}-${itemIdx}`} className={styles.listItem}>
                    <NutIcon />
                    <div>
                      <h3 className={styles.itemTitle}>{item.title}</h3>

                      {/* Список только для третьего пункта */}
                      {itemIdx === 2 ? (
                        <ul className={styles.subList}>
                          {lines.slice(1).map((line, lineIdx) => (
                            <li key={`line-${sectionIdx}-${lineIdx}`}>{line}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className={styles.itemText}>{item.text}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <div className={styles.imageWrapper}>
                <img src="/qr_transparent.png" alt="Оплата" className={styles.image} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className={styles.buttonSection}>
        <div className={styles.buttonWrapper}>
          <button onClick={openModal} className={styles.button}>
            Запросить счёт на крепеж
          </button>
        </div>
      </section>
    </div>
  );
}