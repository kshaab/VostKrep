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
  const [colorsData, setColorsData] = useState<any[]>([])


  const specialSlugs = [
    "samorez-s-psh-ostryj",
    "samorez-s-psh-sverlo",
    "samorez-krovelnyj"
  ]

  const isSpecialCard = specialSlugs.includes(slug)

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
        setColorsData(data.colors || [])

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
    () =>
      colorsData
        .map(c => c.color_name)
        .filter(Boolean),
    [colorsData]
  )

  const color = colors[colorIndex] ?? ""

  // ===== OPTION =====
  const currentOption =
  options.find(
    o =>
      o.size === size &&
      o.length === length
  ) || options[0]

  const imageUrl =
  product?.image
    ? product.image.startsWith("http")
      ? product.image
      : `${process.env.NEXT_PUBLIC_API_URL}${product.image}`
    : "/placeholder.png"

  // ===== CHANGE =====
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

  const changeColor = (dir: number) => {
    setColorIndex((colorIndex + dir + colors.length) % colors.length)
  }

  // ===== CART =====
  const handleAddToCart = () => {
    if (!currentOption || !product) return

    addToCart({
      id: currentOption.sku,
      option_id: currentOption.id,
      name: `${product.name}${
      size || length
        ? ` – ${size ? size : ""}${length ? `x${length}` : ""}`
        : ""
      }${color ? ` (${color})` : ""}`,
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
          <img src={imageUrl} alt={product.name} className={styles.image}/>
        </div>

        <div className={styles.infoBlock}>

          {/* SIZE */}
          {sizes.length > 0 && (
            <div className={styles.selector}>
              <div className={styles.label}>РАЗМЕР</div>
              <div className={styles.control}>
                <button className={styles.controlButton} onClick={() => changeValue("size", -1)}>❮</button>
                <span>{size}</span>
                <button className={styles.controlButton} onClick={() => changeValue("size", 1)}>❯</button>
              </div>
            </div>
          )}

          {/* LENGTH */}
          {lengths.length > 0 && (
            <div className={styles.selector}>
              <div className={styles.label}>ДЛИНА</div>
              <div className={styles.control}>
                <button className={styles.controlButton} onClick={() => changeValue("length", -1)}>❮</button>
                <span>{length}</span>
                <button className={styles.controlButton} onClick={() => changeValue("length", 1)}>❯</button>
              </div>
            </div>
          )}

          {/* COLOR */}
          {colors.length > 0 && (
            <div className={styles.selector}>
              <div className={styles.label}>ЦВЕТ</div>
              <div className={styles.control}>
                <button className={styles.controlButton} onClick={() => changeColor(-1)}>❮</button>
                <span>{color}</span>
                <button className={styles.controlButton} onClick={() => changeColor(1)}>❯</button>
              </div>
            </div>
          )}

          <button onClick={handleAddToCart} disabled={!currentOption} className={styles.addBtn}>
            В КОРЗИНУ
          </button>
        </div>
      </div>
    </section>
  )
}