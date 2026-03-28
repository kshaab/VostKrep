"use client"
import Link from "next/link"
import Image from "next/image"
import { MdPhone, MdEmail } from "react-icons/md";
import { SiTelegram } from "react-icons/si";
import styles from "@/styles/footer_light.module.css";

{/* Светлый подвал */}
export default function FooterLight() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerGrid}>

          <div className={styles.logoContainer}>
            <Image
              src="/logo-dark2.png"
              alt="Восткреп"
              width={420}
              height={120}
              className={styles.logoImage}
              priority
            />
          </div>

           <div className={styles.linksGrid}>

            {/* Колонка 1 */}
            <div className="space-y-6">
              <Link href="/delivery" className={styles.link}>
                ДОСТАВКА
              </Link>
              <Link href="/payment" className={styles.link}>
                ОПЛАТА
              </Link>
              <Link href="#" className={styles.link}>
                О НАС
              </Link>
            </div>

            {/* Колонка 2 */}
            <div className="space-y-6">
              <Link href="/privacy" className={styles.link}>
                ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ
              </Link>
              <Link href="/personal_data" className={styles.link}>
                СОГЛАСИЕ НА ОБРАБОТКУ ДАННЫХ
              </Link>
            </div>

            {/* Колонка 3 */}
            <div className={styles.column}>

              <a
                href="https://t.me/ooovostkrep"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactItem}
              >
                <SiTelegram className={styles.contactIcon} />
                <span>Telegram</span>
              </a>

              <div className={styles.contactItem}>
                <MdPhone size={26} />
                <a href="tel:+74957992359">
                  +7 (495) 799-23-59
                </a>
              </div>

              <div className={styles.contactItem}>
                <MdEmail size={26} />
                <a href="mailto:zakaz@vostkrep.ru">
                  zakaz@vostkrep.ru
                </a>
              </div>

            </div>

          </div>

        </div>
      </div>
    </footer>
  )
}