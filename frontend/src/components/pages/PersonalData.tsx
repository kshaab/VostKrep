"use client";
import { useEffect, useState } from "react";
import { StaticPage } from "@/types/static_pages";
import { endpoints } from "@/lib/api";
import NutIcon from "@/components/icons/NutIcon";
import styles from "@/styles/personal_data.module.css";
import ScrollToTopButton from "@/components/icons/ScrollToTopButton";

export default function PersonalData() {
  const [page, setPage] = useState<StaticPage | null>(null);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    fetch(endpoints.static_pages("personal-data"))
      .then((res) => res.json())
      .then((data) => setPage(data));
  }, []);

   useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 200); // показываем после 200px скролла
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!page) {
    return (
      <div className={styles.loaderWrapper}>
        <p className={styles.loaderText}>Загрузка…</p>
      </div>
    );
  }

  const renderTextWithSubpoints = (text: string) => {
  return text.split("\n").map((line, idx) => {
    line = line.trim();
    if (!line) return null;

    if (line.startsWith("* ")) {
      // подпункт со значком
      return (
        <div key={`bullet-${idx}`} className={styles.bullet}>
          <NutIcon />
          <p className={styles.bulletText}>{line.slice(2)}</p>
        </div>
      );
    }

    const isSubPoint = /^\d+\.\d+/.test(line);
    const isMainPoint = /^\d+\./.test(line) && !isSubPoint;

    if (isMainPoint) {
      return (
        <p key={`main-${idx}`} className={styles.mainPoint}>
          {line}
        </p>
      );
    } else if (isSubPoint) {
      return (
        <p key={`sub-${idx}`} className={styles.subPoint}>
          {line}
        </p>
      );
    } else {
      return (
        <p key={`text-${idx}`} className={styles.text}>
          {line}
        </p>
      );
    }
  });
};

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>{page.title}</h1>

        {page.sections.map((section) => (
          <div key={`section-${section.order}`} className={styles.section}>
            {section.items?.map((item) => (
            <div key={`item-${item.order}`} className={styles.item}>
              {renderTextWithSubpoints(item.text)}
            </div>
          ))}
        </div>
      ))}

    </div>
  );
}