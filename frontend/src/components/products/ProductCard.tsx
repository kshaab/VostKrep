"use client"

import Image from "next/image"
import Link from "next/link"
import { Product } from "@/types/product"

type Props = {
  product: Product
}

export default function ProductCard({ product }: Props) {

  const imageUrl = product.image
    ? `${process.env.NEXT_PUBLIC_API_URL}${product.image}`
    : "/placeholder.png"

  return (
    <Link
      href={`/product/${product.slug}`}
      className="
        bg-white shadow-md cursor-pointer
        hover:border-2 hover:border-[#F0660A]
        transition-all block
      "
    >
      <div className="px-4 py-3 font-semibold md:text-xl">
        {product.name}
      </div>

      <div className="relative h-[180px] w-full">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
    </Link>
  )
}