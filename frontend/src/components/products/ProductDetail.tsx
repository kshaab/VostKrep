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

        const parsed = (data.options ?? []).map((opt: any) => {
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

        setOptions(parsed)
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
          .filter(o => o.size === size)
          .map(o => o.length)
          .filter(Boolean)
      )],
    [options, size]
  )
  const length = lengths[lengthIndex] ?? ""

  // ЦВЕТА — НЕ ЗАВИСЯТ ОТ РАЗМЕРА
  const colors = useMemo(() => {
    return [
      ...new Set(
        options
          .map(o => o.color_name || o.color)
          .filter(Boolean)
      )
    ]
  }, [options])

  const color = colors[colorIndex] ?? ""

  // SKU (БЕЗ цвета)
  const currentOption = options.find(
    o => o.size === size && o.length === length
  )

  // картинка по цвету
  const colorOption = options.find(
  o => (o.color_name || o.color) === color && o.image
)

  const optionImage =
    colorOption?.image
      ? colorOption.image.startsWith("http")
        ? colorOption.image
        : `${process.env.NEXT_PUBLIC_API_URL}${colorOption.image}`
      : null

  const imageUrl =
    optionImage ||
    (product?.image
      ? product.image.startsWith("http")
        ? product.image
        : `${process.env.NEXT_PUBLIC_API_URL}${product.image}`
      : "/placeholder.png")

  const changeValue = (type: "size" | "length" | "color", dir: number) => {
    if (type === "size") {
      const i = (sizeIndex + dir + sizes.length) % sizes.length
      setSizeIndex(i)
      setLengthIndex(0)
    }

    if (type === "length") {
      const i = (lengthIndex + dir + lengths.length) % lengths.length
      setLengthIndex(i)
    }

    if (type === "color") {
      const i = (colorIndex + dir + colors.length) % colors.length
      setColorIndex(i)
    }
  }

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
          {/* размер */}
          {sizes.length > 0 && (
            <div>
              <div>РАЗМЕР</div>
              <button onClick={() => changeValue("size", -1)}>❮</button>
              <span>{size}</span>
              <button onClick={() => changeValue("size", 1)}>❯</button>
            </div>
          )}

          {/* длина */}
          {lengths.length > 0 && (
            <div>
              <div>ДЛИНА</div>
              <button onClick={() => changeValue("length", -1)}>❮</button>
              <span>{length} мм</span>
              <button onClick={() => changeValue("length", 1)}>❯</button>
            </div>
          )}

          {/* цвет */}
          {colors.length > 0 && (
            <div>
              <div>ЦВЕТ</div>
              <button onClick={() => changeValue("color", -1)}>❮</button>
              <span>{color}</span>
              <button onClick={() => changeValue("color", 1)}>❯</button>
            </div>
          )}

          <button onClick={handleAddToCart}>
            В КОРЗИНУ
          </button>
        </div>
      </div>
    </section>
  )
}