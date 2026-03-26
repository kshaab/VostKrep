"use client"

import Image from "next/image"
import Link from "next/link"
import { Category } from "@/types/category"
import styles from "@/styles/category_card.module.css"

type Props = {
  category: Category
}

export default function CategoryCard({ category }: Props) {
  const imageUrl = category.image
    ? category.image.startsWith("http")
      ? category.image
      : `${process.env.NEXT_PUBLIC_API_URL}${category.image}`
    : "/placeholder.png"

  return (
    <Link href={`/catalog/${category.slug}`} className={styles.card}>

      <div className={styles.cardTitle}>
        {category.name}
      </div>

      <div className={styles.imageWrapper}>
        <Image
          src={imageUrl}
          alt={category.name}
          width={500}
          height={500}
          className={styles.image}
          unoptimized
        />
      </div>

    </Link>
  )
}