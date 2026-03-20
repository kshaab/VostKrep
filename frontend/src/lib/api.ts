export const API =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://89.169.160.28"

export const endpoints = {
  categories: `${API}/api/products/categories/`,
  categoryBySlug: (slug: string) =>
    `${API}/api/products/categories/${slug}/`,
  products: `${API}/api/products/products/`,
  productsByCategory: (slug: string) =>
    `${API}/api/products/products/?category=${slug}`,
  productBySlug: (slug: string) =>
    `${API}/api/products/products/${slug}/`,
  delivery: `${API}/api/delivery/`,
  orders: `${API}/api/orders/`,
  static_pages: (slug: string) => `${API}/api/pages/${slug}/`,
}