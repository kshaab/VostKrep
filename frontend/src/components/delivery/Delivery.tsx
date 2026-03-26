"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { DeliveryPage } from "@/types/delivery";
import { useParams } from "next/navigation";
import { endpoints } from "@/lib/api";
import NutIcon from "@/components/icons/NutIcon";
import styles from "@/styles/delivery.module.css";

export default function Delivery() {
  const [delivery, setDelivery] = useState<DeliveryPage | null>(null);
  const params = useParams();
  const slug = params.slug;

  useEffect(() => {
    fetch(endpoints.delivery)
      .then((res) => res.json())
      .then((data) => setDelivery(data));
  }, []);

  if (!delivery) {
    return (
      <div className={styles.loaderWrapper}>
          <p className={styles.loaderText}>Загрузка…</p>
      </div>
    );
  }

  const leftItems = delivery.items.slice(0, 3);
  const rightItems = delivery.items.slice(3);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Заголовок */}
        <section className={styles.titleSection + " pt-10"}>
          <h1>{delivery.title}</h1>
          <p>{delivery.content}</p>
        </section>

        {/* Белый блок */}
        <section className={styles.whiteBlock}>
          <div className={styles.columnsGrid}>
            {/* Левая колонка */}
            <div className="flex flex-col gap-5">
              <ul className={styles.itemList}>
                {leftItems.map((item) => (
                  <li key={item.id}>
                    <NutIcon />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>

              <div className={styles.imageGrid}>
                <Image src="/delivery_icons/ya-del.png" alt="delovie-linii" width={300} height={200} className={styles.image1} />
                <Image src="/delivery_icons/del-lin.png" alt="baikal" width={300} height={200} className={styles.image2} />
              </div>
            </div>

            {/* Правая колонка */}
            <div className="flex flex-col gap-8">
              <ul className={styles.itemList}>
                {rightItems.map((item) => (
                  <li key={item.id}>
                    <NutIcon />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>

              <div className={styles.imageGrid}>
                <Image src="/delivery_icons/zing-log.png" alt="zinger" width={300} height={150} className={styles.image3} />
                <Image src="/delivery_icons/baikal-serv.png" alt="yandex-delivery" width={300} height={150} className={styles.image4} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}