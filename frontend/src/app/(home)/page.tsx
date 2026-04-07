import HomePage from "@/components/pages/HomePage"
import CategoriesSectionClient from "@/components/categories/CategoriesSectionClient"
import CategoriesSectionSSR from "@/components/categories/CategoriesSectionSSR"
import { Category } from "@/types/category"

export default async function Home() {
  let categories: Category[] = []

  try {
    categories = await CategoriesSectionSSR()
  } catch (error) {
    console.error("SSR fetch failed:", error)
    categories = [] // безопасно для сборки
  }

  return (
    <main>
      <HomePage />
      <CategoriesSectionClient categories={categories} /> {/* Клиент для анимации */}
    </main>
  )
}