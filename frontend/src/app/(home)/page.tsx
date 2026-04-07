import HomePage from "@/components/pages/HomePage"
import CategoriesSectionClient from "@/components/categories/CategoriesSectionClient"
import CategoriesSectionSSR from "@/components/categories/CategoriesSectionSSR"

export default async function Home() {
  const categories = await CategoriesSectionSSR() // SSR fetch

  return (
    <main>
      <HomePage />
      <CategoriesSectionClient categories={categories} /> {/* Клиент для анимации */}
    </main>
  )
}