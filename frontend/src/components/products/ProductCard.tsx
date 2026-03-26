"use client"

import Image from "next/image"
import Link from "next/link"
import { Product } from "@/types/product"
import styles from "@/styles/product_card.module.css"

type Props = {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const imageUrl =
    product.image
      ? product.image.startsWith("http")
        ? product.image
        : `${process.env.NEXT_PUBLIC_API_URL}${product.image}`
      : "/placeholder.png"

  return (
    <Link href={`/product/${product.slug}`} className={styles.card}>

      <div className={styles.title}>
        {product.name}
      </div>

      <div className={styles.imageWrapper}>
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 50vw, 25vw"
          unoptimized
        />
      </div>

    </Link>
  )
}