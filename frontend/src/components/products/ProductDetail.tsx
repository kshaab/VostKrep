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
  color: string
  color_name: string
  image?: string
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
  const [colorIndex, setColorIndex] = useState(0)

  // загрузка
  useEffect(() => {
    fetch(endpoints.productBySlug(slug), { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        setProduct(data)

        const parsedOptions = (data.options ?? []).map((opt: any) => {
          const normalized = (opt.size || "").toLowerCase().replace("х", "x")
          const parts = normalized.split("x")

          return {
            id: opt.id,
            size: parts[0]?.trim() || "",
            length: (parts[1] ?? "").replace(/\D/g, ""),
            color: opt.color || "",
            color_name: opt.color_name || "",
            image: opt.image || "",
            sku: opt.sku,
            unit: data.unit || "шт",
          }
        })

        setOptions(parsedOptions)
      })
  }, [slug])

  // размеры
  const sizes = useMemo(
    () => [...new Set(options.map(o => o.size).filter(Boolean))],
    [options]
  )
  const size = sizes[sizeIndex] ?? ""

  // длины
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

  // цвета (RAL)
  const colors = useMemo(
    () =>
      [...new Set(
        options
          .filter(o => o.size === size && o.length === length && o.color_name)
          .map(o => o.color_name)
      )],
    [options, size, length]
  )
  const color = colors[colorIndex] ?? ""

  // выбранная опция
  const currentOption = options.find(o =>
    o.size === size &&
    o.length === length &&
    (colors.length ? o.color_name === color : true)
  )

  // картинка (меняется при смене цвета)
  const optionImage =
    currentOption?.image
      ? currentOption.image.startsWith("http")
        ? currentOption.image
        : `${process.env.NEXT_PUBLIC_API_URL}${currentOption.image}`
      : null

  const imageUrl =
    optionImage ||
    (product?.image
      ? product.image.startsWith("http")
        ? product.image
        : `${process.env.NEXT_PUBLIC_API_URL}${product.image}`
      : "/placeholder.png")

  // переключение
  const changeValue = (type: "size" | "length" | "color", direction: number) => {
    if (type === "size" && sizes.length > 0) {
      const newIndex = (sizeIndex + direction + sizes.length) % sizes.length
      setSizeIndex(newIndex)
      setLengthIndex(0)
      setColorIndex(0)
    }

    if (type === "length" && lengths.length > 0) {
      const newIndex = (lengthIndex + direction + lengths.length) % lengths.length
      setLengthIndex(newIndex)
      setColorIndex(0)
    }

    if (type === "color" && colors.length > 0) {
      const newIndex = (colorIndex + direction + colors.length) % colors.length
      setColorIndex(newIndex)
    }
  }

  // 🛒 корзина
  const handleAddToCart = () => {
    if (!currentOption || !product) return

    addToCart({
      id: currentOption.sku,
      option_id: currentOption.id,
      name: `${product.name} – ${size}x${length}${color ? ` (${color})` : ""}`,
      quantity: 1,
      option: `${size}x${length}${color ? `-${color}` : ""}`,
      unit: currentOption.unit || product.unit || "шт",
    })
  }

  if (!product) return <div>Loading...</div>

  return (
    <section className={styles.product}>
      <div className={styles.titleWrapper}>
        <button
          className={styles.backButton}
          onClick={() => window.history.back()}
        >
          ❮
        </button>

        <div className={styles.title}>
          <AnimatedTitle>{product.name}</AnimatedTitle>
        </div>
      </div>

      <div className={styles.card}>
        {/* картинка */}
        <div className={styles.imageBlock}>
          <img src={imageUrl} alt={product.name} className={styles.image} />
        </div>

        <div className={styles.infoBlock}>
          {/* размер */}
          {sizes.length > 0 && (
            <div className={styles.selector}>
              <div className={styles.label}>РАЗМЕР</div>
              <div className={styles.control}>
                {sizes.length > 1 && (
                  <button onClick={() => changeValue("size", -1)} className={styles.controlButton}>
                    ❮
                  </button>
                )}

                <span>{size}</span>

                {sizes.length > 1 && (
                  <button onClick={() => changeValue("size", 1)} className={styles.controlButton}>
                    ❯
                  </button>
                )}
              </div>
            </div>
          )}

          {/* длина */}
          {lengths.length > 0 && (
            <div className={styles.selector}>
              <div className={styles.label}>ДЛИНА</div>
              <div className={styles.control}>
                {lengths.length > 1 && (
                  <button onClick={() => changeValue("length", -1)} className={styles.controlButton}>
                    ❮
                  </button>
                )}

                <span>{length} мм</span>

                {lengths.length > 1 && (
                  <button onClick={() => changeValue("length", 1)} className={styles.controlButton}>
                    ❯
                  </button>
                )}
              </div>
            </div>
          )}

          {/* цвет (RAL по стрелкам) */}
          {colors.length > 0 && (
            <div className={styles.selector}>
              <div className={styles.label}>ЦВЕТ</div>
              <div className={styles.control}>
                {colors.length > 1 && (
                  <button onClick={() => changeValue("color", -1)} className={styles.controlButton}>
                    ❮
                  </button>
                )}

                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {currentOption?.color && (
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: currentOption.color,
                        display: "inline-block",
                      }}
                    />
                  )}
                  {color}
                </span>

                {colors.length > 1 && (
                  <button onClick={() => changeValue("color", 1)} className={styles.controlButton}>
                    ❯
                  </button>
                )}
              </div>
            </div>
          )}

          {/* кнопка */}
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