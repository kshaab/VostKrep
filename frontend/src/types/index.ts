export type Category = {
  id: number;
  name: string;
  slug: string;
  parent: number | null;
  image: string | null;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: string;
  unit: string;
  image: string | null;
  category: string;
};


