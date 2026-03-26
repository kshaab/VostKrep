"use client";

import React, { useEffect, useState } from "react";
import { endpoints } from "@/lib/api";
import {
  StaticPage,
  StaticPageSection,
  StaticPageItem,
} from "@/types/static_pages";
import NutIcon from "@/components/icons/NutIcon";
import { useModal } from "@/context/FormContext";
import styles from "@/styles/payment.module.css";

export default function Payment() {
  const [page, setPage] = useState<StaticPage | null>(null);
  const { openModal } = useModal();

  const textFromAdmin = `После оформления заказа:
Менеджер подтверждает наличие товара
Формируется счет и согласовываются условия доставки
Заказ комплектуется на складе
Осуществляется доставка или подготовка к самовывозу`;

  const lines = textFromAdmin.split("\n");

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
        <div className={styles.loaderWrapper}>
          <p className={styles.loaderText}>Загрузка…</p>
        </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.container}>

        <section>
          <h1 className={styles.title}>{page.title}</h1>
        </section>

        {page.sections.map((section: StaticPageSection, index) => (
          <div key={section.id ?? index} className={styles.section}>

            <h2 className={styles.sectionTitle}>{section.title}</h2>

            {section.subtitle && (
              <p className={styles.subtitle}>{section.subtitle}</p>
            )}

            <div className={styles.grid}>

              <ul className={styles.list}>
                {section.items?.map((item: StaticPageItem, idx) => (
                  <li key={item.id ?? idx} className={styles.listItem}>
                    <NutIcon />

                    <div>
                      <h3 className={styles.itemTitle}>{item.title}</h3>

                      {idx === 2 ? (
                        <ul className={styles.subList}>
                          {lines.slice(1).map((line, liIdx) => (
                            <li key={liIdx}>{line}</li>
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
                <img
                  src="/qr_transparent.png"
                  alt="Оплата"
                  className={styles.image}
                />
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
