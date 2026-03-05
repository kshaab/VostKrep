export type Product = {
  slug: string
  name: string
  image: string
}

export const products: Product[] = [
  { slug: "bolt", name: "Болт", image: "/products/bolt2.png" },
  { slug: "samorez", name: "Саморез", image: "/products/screw2.png" },
  { slug: "shurup", name: "Шуруп", image: "/products/shurup2.png" },
  { slug: "shpilka", name: "Шпилька", image: "/products/stud.png" },
  { slug: "perf1", name: "Перфорация", image: "/products/perf.png" },
  { slug: "shaiba", name: "Шайба", image: "/products/washer.png" },
  { slug: "gaika", name: "Гайка", image: "/products/nut.png" },
  { slug: "anker1", name: "Анкер", image: "/products/anchor.png" },
  { slug: "anker2", name: "Анкер", image: "/products/anchor.png" },
  { slug: "anker3", name: "Анкер", image: "/products/anchor.png" },

]