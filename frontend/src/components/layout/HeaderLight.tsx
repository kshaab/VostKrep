"use client";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import styles from "@/styles/header_light.module.css";

export default function HeaderLight() {
  const { openCart, items } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.header}>

      {/* === DESKTOP === */}
      <div className={styles.desktopNavContainer}>
        <div className={styles.desktopNavInner}>
          <nav className={styles.desktopNav}>

            <Link href="/" className={styles.desktopNavLink}>
              КАТАЛОГ
            </Link>

            <Link href="/delivery" className={styles.desktopNavLink}>
              ДОСТАВКА
            </Link>

            <a
              href="https://t.me/ooovostkrep"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.desktopNavLink}
            >
              TELEGRAM
            </a>

            <button onClick={openCart} className={styles.cartButton}>
              КОРЗИНА
              {items.length > 0 && (
                <span className={styles.cartBadge}>{items.length}</span>
              )}
            </button>

          </nav>
        </div>
      </div>

      {/* === MOBILE === */}
      <div className={styles.mobileNavContainer}>

        <div className={styles.mobileTopBar}>
          <Link href="/" className={styles.logoLink}>
            <Image src="/logo-dark1.png" alt="logo" width={120} height={40} />
          </Link>

          <div className={styles.burgerCartWrapper}>

            <button onClick={openCart} className={styles.cartIconButton}>
              <ShoppingCart size={28} />
              {items.length > 0 && (
                <span className={styles.cartIconBadge}>{items.length}</span>
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={styles.burgerButton}
            >
              ☰
            </button>

          </div>
        </div>

        <div className={`${styles.mobileMenuWrapper} ${isOpen ? "max-h-96" : "max-h-0"}`}>
          <div className={styles.mobileMenu}>

            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={styles.mobileMenuLink}
            >
              КАТАЛОГ
            </Link>

            <Link
              href="/delivery"
              onClick={() => setIsOpen(false)}
              className={styles.mobileMenuLink}
            >
              ДОСТАВКА
            </Link>

            <a
              href="https://t.me/ooovostkrep"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileMenuLinkLast}
            >
              TELEGRAM
            </a>

          </div>
        </div>
      </div>

    </header>
  );
}