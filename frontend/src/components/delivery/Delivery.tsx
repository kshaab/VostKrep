import React from "react";
import Image from "next/image";
import NutIcon from "@/components/icons/NutIcon";
import styles from "@/styles/delivery.module.css";
import { DeliveryPage } from "@/types/delivery";

type Props = {
  delivery: DeliveryPage;
};

export default function Delivery({ delivery }: Props) {
  const leftItems = delivery.items.slice(0, 3);
  const rightItems = delivery.items.slice(3);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.titleSection + " pt-10"}>
          <h1>{delivery.title}</h1>
          <p>{delivery.content}</p>
        </section>

        <section className={styles.whiteBlock}>
          <div className={styles.columnsGrid}>
            {/* ЛЕВАЯ КОЛОНКА */}
            <div>
              <ul className={styles.itemList}>
                {leftItems.map((item) => (
                  <li key={item.id}>
                    <NutIcon />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ПРАВАЯ КОЛОНКА */}
            <div>
              <ul className={styles.itemList}>
                {rightItems.map((item) => (
                  <li key={item.id}>
                    <NutIcon />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.imagesWrapper}>
            <Image src="/delivery_icons/ya-del.png" alt="ya" width={160} height={160} />
            <Image src="/delivery_icons/del-lin.png" alt="dl" width={160} height={160} />
            <Image src="/delivery_icons/zing-log.png" alt="zl" width={160} height={160} />
            <Image src="/delivery_icons/baikal-serv.png" alt="bs" width={160} height={160} />
          </div>
        </section>
      </div>
    </div>
  );
}