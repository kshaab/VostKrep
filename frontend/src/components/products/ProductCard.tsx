"use client"

import Image from "next/image"
import Link from "next/link"
import { Product } from "@/types/product"

{/* Карточка продукта на странице продуктов */}
type Props = {
  product: Product
}

export default function ProductCard({ product }: Props) {
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
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
    </Link>
  )
}