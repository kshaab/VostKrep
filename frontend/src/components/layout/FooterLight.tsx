"use client"
import Link from "next/link"
import Image from "next/image"
import { MdPhone, MdEmail } from "react-icons/md";
import { SiTelegram } from "react-icons/si";
import styles from "@/styles/footer_light.module.css";

{/* Светлый подвал */}
export default function FooterLight() {
  return (
    <footer className={styles.footer} data-nosnippet="">
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
            <div className={styles.column}>
              <Link href="/about" className={styles.link}>
                О НАС
              </Link>
              <Link href="/payment" className={styles.link}>
                ОПЛАТА
              </Link>
              <Link href="/delivery" className={styles.link}>
                ДОСТАВКА
              </Link>
            </div>

            {/* Колонка 2 */}
            <div className={styles.column}>
              <Link href="/privacy" className={styles.link}>
                ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ
              </Link>
              <Link href="/personal_data" className={styles.link}>
                СОГЛАСИЕ НА ОБРАБОТКУ ДАННЫХ
              </Link>
            </div>

            {/* Колонка 3 */}
            <div className={styles.column}>

              <div className={styles.contactItem}>
                  <SiTelegram className={styles.contactIcon} />

                  <div className="telegram-container">
                    <a
                      href="https://t.me/ooovostkrep"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="telegram-word"
                    >
                      Telegram
                    </a>
                    <span> / </span>
                    <a
                      href="https://max.ru/u/f9LHodD0cOIcbY867yMVmxWUyr1KZH8Tr1Lo2n9OIN_uw9WsnmSgKXK7pFQ"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="telegram-word"
                    >
                      Max
                    </a>
                  </div>

                  <style jsx>{`
                    .telegram-container {
                      display: flex;
                      align-items: center;
                      gap: 0.25rem; 
                    }
                    .telegram-word {
                      color: #003399; 
                      transition: color 0.2s;
                    }
                    .telegram-word:hover {
                      color: #F0660A;
                    }
                    .telegram-container span {
                      color: #003399; 
                    }
                  `}</style>
                </div>

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