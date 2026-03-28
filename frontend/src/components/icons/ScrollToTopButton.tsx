"use client";
import { useState, useEffect } from "react";
import styles from "@/styles/scroll_to_top.module.css";

interface Props {
  containerId: string;
}

export default function ScrollToTopButton({ containerId }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById(containerId);
      if (!container) return;

      const rect = container.getBoundingClientRect();


      if (rect.top < window.innerHeight - 100) setVisible(true);
      else setVisible(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [containerId]);

  const scrollToTop = () => {
    const container = document.getElementById(containerId);
    if (!container) return;
    window.scrollTo({ top: container.offsetTop, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={styles.scrollButton}
    >
      ꜛ
    </button>
  );
}