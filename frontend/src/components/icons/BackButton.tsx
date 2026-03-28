"use client"

import styles from "@/styles/product_detail.module.css";

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className={styles.backButton}
    >
      ❮
    </button>
  )
}