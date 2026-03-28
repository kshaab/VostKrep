"use client"

import { useState, useMemo, useEffect } from "react"
import { useCart } from "@/context/CartContext"
import { Product } from "@/types/product"
import { endpoints } from "@/lib/api"
import styles from "@/styles/product_detail.module.css"
import AnimatedTitle from "@/components/animation/AnimatedTitle"

type Option = {
  id: number
  size: string
  length: string
  sku: string
  unit: string
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
       const normalized = opt.size.toLowerCase().replace("х", "x")
       const parts = normalized.split("x")
       const sizePart = parts[0].trim()
       const rawLength = (parts[1] ?? "").replace(/\D/g, "")

       return {
          id: opt.id,
          size: sizePart,
          length: rawLength === "0" ? "" : rawLength,
          sku: opt.sku,
          unit: data.unit || "шт",
        }
      })

        setOptions(parsedOptions)
      })
  }, [slug])

  // Уникальные размеры
  const sizes = useMemo(
  () => [...new Set(options.map(o => o.size).filter(Boolean))],
  [options]
  )
  const size = sizes[sizeIndex] ?? ""

  // Уникальные длины для выбранного размера
  const lengths = useMemo(
  () =>
    [...new Set(
      options
        .filter(o => o.size === size && o.length)
        .map(o => o.length)
    )],
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
      name: `${product.name} – ${size}x${length}`,
      quantity: 1,
      option: `${size}x${length}`,
      unit: currentOption.unit || product.unit || "шт",
    })
  }

  if (!product) return <div>Loading...</div>

  const imageUrl =
    product.image
      ? product.image.startsWith("http")
        ? product.image
        : `${process.env.NEXT_PUBLIC_API_URL}${product.image}`
      : "/placeholder.png"

  return (
    <section className={styles.product}>
      <div className={styles.titleWrapper}>
        <button className={styles.backButton} onClick={() => window.history.back()}>
          ❮
        </button>
      {/* Заголовок */}
      <div className={styles.title}>
        <AnimatedTitle>{product.name}</AnimatedTitle>
      </div>
      </div>

      {/* Карточка продукта */}
      <div className={styles.card}>
        {/* Картинка */}
        <div className={styles.imageBlock}>
          <img src={imageUrl} alt={product.name} className={styles.image} />
        </div>

        {/* Блок информации */}
        <div className={styles.infoBlock}>
          {/* Селектор размера */}
          {sizes.length > 0 && (
          <div className={styles.selector}>
            <div className={styles.label}>РАЗМЕР</div>
            <div className={styles.control}>
              {sizes.length > 1 && (
                <button
                onClick={() => {
                  changeValue("size", -1)
                }}
                 className={styles.controlButton}
              >
                ❮
              </button>
              )}

              <span>{size ? `${size} ` : ""}</span>

              {sizes.length > 1 && (
                <button
                  onClick={() => {
                    changeValue("size", 1)
                  }}
                   className={styles.controlButton}
                >
                  ❯
                </button>
              )}
            </div>
          </div>
          )}

          {/* Селектор длины */}
          {lengths.length > 0 && (
          <div className={styles.selector}>
            <div className={styles.label}>ДЛИНА</div>
            <div className={styles.control}>
              {lengths.length > 1 && (
                <button
                onClick={() => {
                  changeValue("length", -1)
                }}
                 className={styles.controlButton}
              >
                ❮
              </button>
              )}

              <span> {length ? `${length} мм` : ""}</span>

              {lengths.length > 1 && (
                <button
                onClick={() => {
                  changeValue("length", 1)
                }}
                className={styles.controlButton}
              >
                ❯
              </button>
              )}
            </div>
          </div>
          )}

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