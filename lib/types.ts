export type Category = "all" | string;

export type Product = {
  id: number;

  name: string;

  slug: string;

  sku?: string;

  english?: string;

  category: Category;

  categories?: {
    id: number;
    name: string;
    slug: string;
  }[];

  price: number;

  regularPrice?: number;

  salePrice?: number;

  onSale?: boolean;

  image: string;

  images: string[];

  label?: string;

  description?: string;

  shortDescription?: string;

  stockStatus?: string;

  isInStock?: boolean;

  isPurchasable?: boolean;

  lowStockRemaining?: number | null;

  averageRating?: number;

  reviewCount?: number;

  hasOptions?: boolean;

  attributes?: {
    name: string;
    options: string[];
  }[];
};