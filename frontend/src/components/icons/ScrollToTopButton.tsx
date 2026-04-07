"use client";
import { useState, useEffect } from "react";
import styles from "@/styles/scroll_to_top.module.css";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Смотрим прокрутку окна, а не контейнера
      setVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button onClick={scrollToTop} className={styles.scrollButton}>
      ꜛ
    </button>
  );
}