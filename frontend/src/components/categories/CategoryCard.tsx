"use client"

import Image from "next/image"
import Link from "next/link"
import { Category } from "@/data/categories"

{/* Карточка категорий */}
type Props = {
  category: Category
}

export default function CategoryCard({ category }: Props) {
  return (
    <Link
      href={`/catalog/${category.slug}`}
      className="
        bg-white shadow-md cursor-pointer
        hover:border-2 hover:border-[#F0660A]
        transition-all block
      "
    >
      <div className="px-4 py-3 font-semibold md:text-xl">
        {category.name}
      </div>

      <div className="relative h-[180px] w-full">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover"
        />
      </div>
    </Link>
  )
}