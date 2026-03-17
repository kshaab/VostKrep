"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import { useCart } from "@/context/CartContext"
import { Product } from "@/types/product"
import { endpoints } from "@/lib/api"
import styles from "./product.module.css"
import AnimatedTitle from "@/components/AnimatedTitle"

type Option = {
  id: number
  size: string
  length: string
  sku: string
}

type Props = {
  slug: string
}

export default function ProductDetail({ slug }: Props) {
  const { addToCart } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [options, setOptions] = useState<Option[]>([])
  const [sizeIndex, setSizeIndex] = useState(0)
  const [lengthIndex, setLengthIndex] = useState(0)

  // Загрузка продукта и опций
  useEffect(() => {
    fetch(endpoints.productBySlug(slug), { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        setProduct(data)

        const parsedOptions = (data.options ?? []).map((opt: any) => {
  const normalized = opt.size
    .toLowerCase()
    .replace("х", "x")

  const parts = normalized.split("x")

  const sizePart = parts[0].trim()
  const lengthPart = (parts[1] ?? "0").replace(/\D/g, "")

  return {
    id: opt.id,
    size: sizePart,
    length: lengthPart,
    sku: opt.sku
  }
})

        setOptions(parsedOptions)
      })
  }, [slug])

  // Уникальные размеры
  const sizes = useMemo(() => [...new Set(options.map(o => o.size))], [options])
  const size = sizes[sizeIndex] ?? ""

  // Уникальные длины для выбранного размера
  const lengths = useMemo(
    () => [...new Set(options.filter(o => o.size === size).map(o => o.length))],
    [options, size]
  )
  const length = lengths[lengthIndex] ?? ""

  // Текущая выбранная опция
  const currentOption = options.find(o => o.size === size && o.length === length)

  // Листание размера/длины
  const changeValue = (type: "size" | "length", direction: number) => {
    if (type === "size" && sizes.length > 0) {
      const newSizeIndex = (sizeIndex + direction + sizes.length) % sizes.length
      setSizeIndex(newSizeIndex)
      setLengthIndex(0) // сброс длины при смене размера
    }

    if (type === "length" && lengths.length > 0) {
      const newLengthIndex = (lengthIndex + direction + lengths.length) % lengths.length
      setLengthIndex(newLengthIndex)
    }
  }

  const handleAddToCart = () => {
    if (!currentOption || !product) return

    addToCart({
      id: currentOption.sku,
      option_id: currentOption.id,
      name: `${product.name} ${size}x${length}`,
      quantity: 1
    })
  }

  if (!product) return <div>Loading...</div>

  const imageUrl = product.image
    ? `${process.env.NEXT_PUBLIC_API_URL}${product.image}`
    : "/placeholder.png"

  return (
    <section className={styles.product}>
      <div className={styles.title}>
        <AnimatedTitle>
          {product.name}
        </AnimatedTitle>
      </div>

      <div className={styles.card}>
        <div className={styles.imageBlock}>
          <Image src={imageUrl} alt={product.name} width={500} height={400} />
        </div>

        <div className={styles.infoBlock}>
          {/* Селектор размера */}
          <div className={styles.selector}>
            <div className={styles.label}>РАЗМЕР</div>
            <div className={styles.control}>
              <button onClick={() => changeValue("size", -1)}>❮</button>
              <span>{size}</span>
              <button onClick={() => changeValue("size", 1)}>❯</button>
            </div>
          </div>

          {/* Селектор длины */}
          <div className={styles.selector}>
            <div className={styles.label}>ДЛИНА</div>
            <div className={styles.control}>
              <button onClick={() => changeValue("length", -1)}>❮</button>
              <span>{length} мм</span>
              <button onClick={() => changeValue("length", 1)}>❯</button>
            </div>
          </div>

          {/* Кнопка добавления в корзину */}
          <button
            onClick={handleAddToCart}
            disabled={!currentOption}
            className={styles.addBtn}
          >
            В КОРЗИНУ
          </button>
        </div>
      </div>
    </section>
  )
}