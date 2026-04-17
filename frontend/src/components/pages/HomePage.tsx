import Image from "next/image";
import NutIcon from "@/components/icons/NutIcon";
import OpenModalButton from "@/components/icons/OpenModalButton";
import styles from "@/styles/home_page.module.css";

export default function HomePage() {
  return (
    <div className={styles.root}>

      {/* UI HEADER */}
      <section className={styles.header}>
        <div className="px-6">
          <h1 className={styles.title}>
            ВОСТОЧНЫЙ КРЕПЁЖ
          </h1>
        </div>
      </section>

      {/* MAIN VISUAL SECTION */}
      <section
        className={styles.whiteSection}
        style={{
          backgroundImage: "url('/back_home.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className={styles.grid}>

          <div className={styles.imageWrapper}>
            <Image
              src="/logo-dark2.png"
              alt="Крепёж оптом Восточный Крепёж"
              width={600}
              height={600}
              className={styles.image}
              priority
            />
          </div>

          <ul className={styles.list}>
            <li className={styles.listItem}>
              <NutIcon />
              <span>
                Широкий ассортимент высококачественных крепёжных изделий по выгодным оптовым ценам
              </span>
            </li>

            <li className={styles.listItem}>
              <NutIcon />
              <span>
                Надёжные поставки, стабильное качество и индивидуальный подход к каждому клиенту
              </span>
            </li>
          </ul>
        </div>

        <div className={styles.mobileButtonWrapper}>
          <OpenModalButton />
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={styles.buttonSection}>
        <div className={styles.buttonWrapper}>
          <OpenModalButton />
        </div>
      </section>
    </div>
  );
}