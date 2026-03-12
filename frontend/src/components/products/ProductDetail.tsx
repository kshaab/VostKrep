"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import { useCart } from "@/context/CartContext"
import { Product } from "@/types/product"
import {endpoints} from "@/lib/api";

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

  useEffect(() => {

    fetch(endpoints.productBySlug(slug), {
      cache: "no-store"
    })
      .then((res) => res.json())
      .then((data) => {

        setProduct(data)

        const parsedOptions = data.options.map((opt: any) => {

          const parts = opt.size.toLowerCase().split("x")

          return {
            id: opt.id,
            size: parts[0],
            length: parts[1],
            sku: opt.sku,
          }

        })

        setOptions(parsedOptions)

      })

  }, [slug])

  const sizes = useMemo(() => {
    return [...new Set(options.map(o => o.size))]
  }, [options])

  const lengths = useMemo(() => {
    return [...new Set(options.map(o => o.length))]
  }, [options])

  const size = sizes[sizeIndex]
  const length = lengths[lengthIndex]

  const currentOption = options.find(
    o => o.size === size && o.length === length
  )

  const changeValue = (type: "size" | "length", direction: number) => {

    if (type === "size") {
      setSizeIndex(prev =>
        (prev + direction + sizes.length) % sizes.length
      )
    }

    if (type === "length") {
      setLengthIndex(prev =>
        (prev + direction + lengths.length) % lengths.length
      )
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
    <section className="max-w-6xl mx-auto py-10">

      <h1 className="text-3xl font-bold mb-6">
        {product.name}
      </h1>

      <Image
        src={imageUrl}
        alt={product.name}
        width={500}
        height={400}
      />

      <div className="mt-10 flex gap-6 items-center">

        <button onClick={() => changeValue("size", -1)}>❮</button>
        <span>{size}</span>
        <button onClick={() => changeValue("size", 1)}>❯</button>

        <button onClick={() => changeValue("length", -1)}>❮</button>
        <span>{length} мм</span>
        <button onClick={() => changeValue("length", 1)}>❯</button>

        <button
          onClick={handleAddToCart}
          disabled={!currentOption}
          className="
            bg-[#F0660A] text-white px-6 py-3
            hover:bg-[#d45b09]
          "
        >
          В КОРЗИНУ
        </button>

      </div>

    </section>
  )
}