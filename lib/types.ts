export type Category = "all" | string;


/* =========================
   PRODUCT
========================= */

export type Product = {

  id: number;

  name: string;

  slug: string;

  permalink?: string;

  sku?: string;


  /* PRICE */

  price: number;

  regularPrice?: number;

  salePrice?: number;

  onSale?: boolean;


  /* TEXT */

  description?: string;

  shortDescription?: string;


  /* IMAGE */

  image: string;

  images: string[];


  /* CATEGORY */

  category: Category;

  categories?: ProductCategory[];


  /* LABEL */

  label?: string;

  english?: string;


  /* STOCK */

  stockStatus?: string;

  isInStock?: boolean;

  isPurchasable?: boolean;

  isOnBackorder?: boolean;

  lowStockRemaining?: number | null;


  /* REVIEW */

  averageRating?: number;

  reviewCount?: number;


  /* OPTIONS */

  hasOptions?: boolean;


  /* ATTRIBUTES */

  attributes?: ProductAttribute[];


  /* VARIATIONS */

  variations?: ProductVariation[];


  /* CART */

  addToCart?: AddToCartData;


  /* EXTRA */

  type?: string;

  weight?: string;

  dimensions?: ProductDimensions;

};



/* =========================
   CATEGORY
========================= */

export type ProductCategory = {

  id: number;

  name: string;

  slug: string;

};



/* =========================
   ATTRIBUTES
========================= */

export type ProductAttribute = {

  id?: number;

  name: string;

  options: string[];

  taxonomy?: string | null;

};



/* =========================
   VARIATIONS
========================= */

export type ProductVariation = {

  id: number;

  name?: string;

  price?: number;

  attributes?: {
    name: string;
    option: string;
  }[];

};



/* =========================
   CART DATA
========================= */

export type AddToCartData = {

  text?: string;

  description?: string;

  url?: string;

  minimum?: number;

  maximum?: number;

};



/* =========================
   DIMENSIONS
========================= */

export type ProductDimensions = {

  length?: string;

  width?: string;

  height?: string;

};