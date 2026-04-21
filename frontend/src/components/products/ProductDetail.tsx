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

  useEffect(() => {
    fetch(endpoints.productBySlug(slug), { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        setProduct(data)

        const parsedOptions = (data.options ?? []).map((opt: any) => {
          const normalized = (opt.size || "").toLowerCase().replace("х", "x")
          const parts = normalized.split("x")

          const sizePart = parts[0]?.trim() || ""
          const rawLength = (parts[1] ?? "").replace(/\D/g, "")

          return {
            id: opt.id,
            size: sizePart,
            length: rawLength === "0" ? "" : rawLength,
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

  // ===== SIZE =====
  const sizes = useMemo(
    () => [...new Set(options.map(o => o.size).filter(Boolean))],
    [options]
  )

  const size = sizes[sizeIndex] ?? ""

  // ===== LENGTH =====
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

  // ===== COLOR =====
  const colors = useMemo(
    () => [
      ...new Set(
        options
          .map(o => o.color_name || o.color)
          .filter(Boolean)
      )
    ],
    [options]
  )

  const color = colors[colorIndex] ?? ""

  // ===== CURRENT OPTION (SKU без цвета) =====
  const currentOption = options.find(
    o => o.size === size && o.length === length
  )

  // ===== IMAGE BY COLOR =====
  const colorOption = options.find(
    o => (o.color_name || o.color) === color && o.image
  )

  const imageUrl =
    colorOption?.image
      ? colorOption.image.startsWith("http")
        ? colorOption.image
        : `${process.env.NEXT_PUBLIC_API_URL}${colorOption.image}`
      : product?.image
      ? product.image.startsWith("http")
        ? product.image
        : `${process.env.NEXT_PUBLIC_API_URL}${product.image}`
      : "/placeholder.png"

  // ===== CHANGE HANDLERS =====
  const changeValue = (type: "size" | "length", direction: number) => {
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
  }

  const changeColor = (direction: number) => {
    if (colors.length === 0) return

    const newIndex =
      (colorIndex + direction + colors.length) % colors.length

    setColorIndex(newIndex)
  }

  // ===== CART =====
  const handleAddToCart = () => {
    if (!currentOption || !product) return

    addToCart({
      id: currentOption.sku,
      option_id: currentOption.id,
      name: `${product.name} – ${size}x${length}${color ? ` (${color})` : ""}`,
      quantity: 1,
      option: `${size}x${length}`,
      unit: currentOption.unit || product.unit || "шт",
    })
  }

  if (!product) return <div>Loading...</div>

  return (
    <section className={styles.product}>
      <div className={styles.titleWrapper}>
        <button onClick={() => window.history.back()}>❮</button>
        <AnimatedTitle>{product.name}</AnimatedTitle>
      </div>

      <div className={styles.card}>
        <div className={styles.imageBlock}>
          <img src={imageUrl} alt={product.name} />
        </div>

        <div className={styles.infoBlock}>

          {/* SIZE */}
          {sizes.length > 0 && (
            <div className={styles.selector}>
              <div className={styles.label}>РАЗМЕР</div>
              <div className={styles.control}>
                {sizes.length > 1 && (
                  <button onClick={() => changeValue("size", -1)}>❮</button>
                )}
                <span>{size}</span>
                {sizes.length > 1 && (
                  <button onClick={() => changeValue("size", 1)}>❯</button>
                )}
              </div>
            </div>
          )}

          {/* LENGTH */}
          {lengths.length > 0 && (
            <div className={styles.selector}>
              <div className={styles.label}>ДЛИНА</div>
              <div className={styles.control}>
                {lengths.length > 1 && (
                  <button onClick={() => changeValue("length", -1)}>❮</button>
                )}
                <span>{length} мм</span>
                {lengths.length > 1 && (
                  <button onClick={() => changeValue("length", 1)}>❯</button>
                )}
              </div>
            </div>
          )}

          {/* COLOR */}
          {colors.length > 0 && (
            <div className={styles.selector}>
              <div className={styles.label}>ЦВЕТ</div>
              <div className={styles.control}>
                {colors.length > 1 && (
                  <button onClick={() => changeColor(-1)}>❮</button>
                )}
                <span>{color}</span>
                {colors.length > 1 && (
                  <button onClick={() => changeColor(1)}>❯</button>
                )}
              </div>
            </div>
          )}

          {/* CART */}
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