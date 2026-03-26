"use client";
import Image from "next/image";
import { useModal } from "@/context/FormContext";
import NutIcon from "@/components/icons/NutIcon";
import styles from "@/styles/home_page.module.css";

export default function HomePage() {
  const { openModal } = useModal();

  return (
    <div className={styles.root}>

      {/* Заголовок */}
      <section className={styles.header}>
        <div className="px-6">
          <h1 className={styles.title}>
            ВОСТОЧНЫЙ КРЕПЁЖ
          </h1>
        </div>
      </section>

      {/* Белый блок */}
      <section className={styles.whiteSection}  style={{
        backgroundImage: "url('/back_home.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <div className={styles.grid}>

          {/* Картинка */}
          <div className={styles.imageWrapper}>
            <Image
              src="/logo-dark1.png"
              alt="logo_home"
              width={600}
              height={600}
              className={styles.image}
            />
          </div>

          {/* Текст */}
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <NutIcon />
              <span>
                Широкий ассортимент высококачественных крепёжных изделий
                по выгодным оптовым ценам.
              </span>
            </li>

            <li className={styles.listItem}>
              <NutIcon />
              <span>
                Ключевые ценности — надёжность поставок, качество продукции
                и индивидуальный подход к каждому клиенту.
              </span>
            </li>
          </ul>
        </div>
         <div className={styles.mobileButtonWrapper}>
          <button onClick={openModal} className={styles.button}>
            ОСТАВИТЬ ЗАЯВКУ
          </button>
        </div>
      </section>


      {/* Кнопка */}
      <section className={styles.buttonSection}>
        <div className={styles.buttonWrapper}>
          <button onClick={openModal} className={styles.button}>
            ОСТАВИТЬ ЗАЯВКУ
          </button>
        </div>
      </section>

    </div>
  );
}