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


  const specialSlugs = [
    "samorez-s-psh-ostryj",
    "samorez-s-psh-sverlo",
  ]

  const isColorImageEnabled = specialSlugs.includes(slug)
  const isSpecialCard = isColorImageEnabled

  useEffect(() => {
    setProduct(null)
    setOptions([])
    setSizeIndex(0)
    setLengthIndex(0)
    setColorIndex(0)

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

  // ===== OPTION =====
  const currentOption = options.find(
    o => o.size === size && o.length === length
  )

  // ===== IMAGE ONLY FOR SPECIAL PRODUCTS =====
  const colorOption =
    isColorImageEnabled
      ? options.find(
          o =>
            (o.color_name || o.color) === color &&
            o.image
        )
      : null

  const imageUrl =
    isColorImageEnabled && colorOption?.image
      ? colorOption.image.startsWith("http")
        ? colorOption.image
        : `${process.env.NEXT_PUBLIC_API_URL}${colorOption.image}`
      : product?.image
      ? product.image.startsWith("http")
        ? product.image
        : `${process.env.NEXT_PUBLIC_API_URL}${product.image}`
      : "/placeholder.png"

  // ===== CHANGE =====
  const changeValue = (type: "size" | "length", dir: number) => {
    if (type === "size") {
      setSizeIndex((sizeIndex + dir + sizes.length) % sizes.length)
      setLengthIndex(0)
      setColorIndex(0)
    }

    if (type === "length") {
      setLengthIndex((lengthIndex + dir + lengths.length) % lengths.length)
      setColorIndex(0)
    }
  }

  const changeColor = (dir: number) => {
    setColorIndex((colorIndex + dir + colors.length) % colors.length)
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
        <button className={styles.backButton} onClick={() => window.history.back()}>❮</button>
        <AnimatedTitle>{product.name}</AnimatedTitle>
      </div>

      <div className={`${styles.card} ${isSpecialCard ? styles.screwsCard : ""}`}>
        <div className={styles.imageBlock}>
          <img src={imageUrl} alt={product.name} />
        </div>

        <div className={styles.infoBlock}>

          {/* SIZE */}
          <div className={styles.selector}>
            <div className={styles.label}>РАЗМЕР</div>
            <div className={styles.control}>
              <button onClick={() => changeValue("size", -1)}>❮</button>
              <span>{size}</span>
              <button onClick={() => changeValue("size", 1)}>❯</button>
            </div>
          </div>

          {/* LENGTH */}
          <div className={styles.selector}>
            <div className={styles.label}>ДЛИНА</div>
            <div className={styles.control}>
              <button onClick={() => changeValue("length", -1)}>❮</button>
              <span>{length}</span>
              <button onClick={() => changeValue("length", 1)}>❯</button>
            </div>
          </div>

          {/* COLOR */}
          {isColorImageEnabled && (
            <div className={styles.selector}>
              <div className={styles.label}>ЦВЕТ</div>
              <div className={styles.control}>
                <button onClick={() => changeColor(-1)}>❮</button>
                <span>{color}</span>
                <button onClick={() => changeColor(1)}>❯</button>
              </div>
            </div>
          )}

          <button onClick={handleAddToCart} className={styles.addBtn}>
            В КОРЗИНУ
          </button>
        </div>
      </div>
    </section>
  )
}