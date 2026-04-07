"use client";

import { useModal } from "@/context/FormContext";
import styles from "@/styles/home_page.module.css";

export default function OpenModalButton() {
  const { openModal } = useModal();

  return (
    <button onClick={openModal} className={styles.button}>
      ОСТАВИТЬ ЗАЯВКУ
    </button>
  );
}