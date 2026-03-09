"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import { useCart } from "@/context/CartContext"
import { Product } from "@/types/product"
import { endpoints} from "@/lib/api"

type Option = {
  id: number
  size: string
  price: number
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

  useEffect(() => {
    fetch(endpoints.productBySlug(slug))
      .then((res) => res.json())
      .then((data) => {
        setProduct(data)
        setOptions(data.options || [])
      })
  }, [slug])

  // Разбор параметров на длину и размер
  const validCombinations = useMemo(() => {
    return options.map((opt) => {
      const [size, length] = opt.size.split("x")
      return {
        id: opt.id,
        size,
        length,
        sku: opt.sku,
        price: opt.price,
      }
    })
  }, [options])

  const sizes = [...new Set(validCombinations.map((i) => i.size))]
  const lengths = [...new Set(validCombinations.map((i) => i.length))]

  const size = sizes[sizeIndex]
  const length = lengths[lengthIndex]

  const currentOption = validCombinations.find(
    (item) => item.size === size && item.length === length
  )

  const isValid = !!currentOption

  const changeValue = (type: "size" | "length", direction: number) => {
    if (type === "size") {
      setSizeIndex((prev) => (prev + direction + sizes.length) % sizes.length)
    } else {
      setLengthIndex((prev) => (prev + direction + lengths.length) % lengths.length)
    }
  }

  const handleAddToCart = () => {
    if (!currentOption || !product) return

    addToCart({
      id: currentOption.sku,
      option_id: currentOption.id,
      name: `${product.name} ${size}x${length}`,
      price: currentOption.price,
      quantity: 1,
    })
  }

  if (!product) return null

  return (
    <section>
      <h1>{product.name}</h1>

      <Image
        src={product.image}
        alt={product.name}
        width={500}
        height={400}
      />

      <div>
        <button onClick={() => changeValue("size", -1)}>❮</button>
        <span>{size}</span>
        <button onClick={() => changeValue("size", 1)}>❯</button>

        <button onClick={() => changeValue("length", -1)}>❮</button>
        <span>{length} мм</span>
        <button onClick={() => changeValue("length", 1)}>❯</button>

        <button onClick={handleAddToCart} disabled={!isValid}>
          В КОРЗИНУ
        </button>
      </div>
    </section>
  )
}