"use client"

import Image from "next/image"
import Link from "next/link"
import { Category } from "@/types/category"

{/* Карточка категорий */}
type Props = {
  category: Category
}

export default function CategoryCard({ category }: Props) {

  const imageUrl = category.image.startsWith("http")
  ? category.image
  : `http://127.0.0.1:8000${category.image}`

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

      <div className="relative h-[200px] w-full">
        <Image
          src={imageUrl}
          alt={category.name}
          width={500}
          height={500}
          className="w-full h-[200px] object-contain"
          unoptimized //УБРАТЬ ДЛЯ ПРОДА
        />
      </div>
    </Link>
  )
}