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
                <Image src="/delivery_icons/ya-del.png" alt="delovie-linii" width={300} height={200} />
                <Image src="/delivery_icons/del-lin.png" alt="baikal" width={300} height={200} />
              </div>
            </div>

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
                <Image src="/delivery_icons/zing-log.png" alt="zinger" width={300} height={150} />
                <Image src="/delivery_icons/baikal-serv.png" alt="yandex-delivery" width={300} height={150} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}