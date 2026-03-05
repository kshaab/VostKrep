"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import styles from "./product.module.css"
import { useCart } from "@/context/CartContext"

{/* Подробная карточка продукта */}
export default function ProductDetail() {

  const { addToCart } = useCart()

  const handleAddToCart = () => {
  if (!isValid) return

  addToCart({
    id: `${size}${length}`, // временный id
    name: `Болт ${size} x ${length} мм`,
    price: 0,
    quantity: 1,
  })
}

  const sizes = ["M6", "M8", "M10"]
  const lengths = ["20", "30", "40", "50"]

  const validCombinations = [
    { size: "M6", length: "20" },
    { size: "M6", length: "30" },
    { size: "M8", length: "30" },
    { size: "M10", length: "40" },
    { size: "M10", length: "50" },
  ]

  const [sizeIndex, setSizeIndex] = useState(0)
  const [lengthIndex, setLengthIndex] = useState(0)

  const size = sizes[sizeIndex]
  const length = lengths[lengthIndex]

  const isValid = useMemo(() => {
    return validCombinations.some(
      (item) => item.size === size && item.length === length
    )
  }, [size, length])

  const changeValue = (type: "size" | "length", direction: number) => {
    if (type === "size") {
      setSizeIndex((prev) => (prev + direction + sizes.length) % sizes.length)
    } else {
      setLengthIndex((prev) => (prev + direction + lengths.length) % lengths.length)
    }
  }

  return (
    <section className={styles.product}>
      <h1 className={styles.title}>НАЗВАНИЕ ТОВАРА</h1>

      <div className={styles.card}>
        <div className={styles.imageBlock}>
          <Image
            src="/products/bolt4.png"
            alt="Болт"
            width={550}
            height={500}
            className={styles.image}
            priority
          />
        </div>

        <div className={styles.infoBlock}>
          <div className={styles.selector}>
            <div className={styles.label}>РАЗМЕР</div>
            <div className={styles.control}>
              <button onClick={() => changeValue("size", -1)}>❮</button>
              <span>{size}</span>
              <button onClick={() => changeValue("size", 1)}>❯</button>
            </div>
          </div>

          <div className={styles.selector}>
            <div className={styles.label}>ДЛИНА</div>
            <div className={styles.control}>
              <button onClick={() => changeValue("length", -1)}>❮</button>
              <span>{length} мм</span>
              <button onClick={() => changeValue("length", 1)}>❯</button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`${styles.addBtn} ${isValid ? styles.active : ""}`}
            disabled={!isValid}
          >
            В КОРЗИНУ
          </button>
        </div>
      </div>
    </section>
  )
}