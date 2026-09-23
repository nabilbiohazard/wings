import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/shop/product-gallery";
import { getProduct } from "@/lib/get-product";
import { persianNumber } from "@/lib/products";

function stripHtml(html?: string) {
  if (!html) return "";

  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const images = product.images?.length > 0 ? product.images : [product.image];

  const category = product.categories?.[0]?.name;

  const categorySlug = product.categories?.[0]?.slug;

  const hasDiscount =
    Boolean(product.onSale) &&
    Boolean(product.regularPrice) &&
    Boolean(product.salePrice) &&
    Number(product.regularPrice) > Number(product.salePrice);

  const currentPrice = hasDiscount ? product.salePrice! : product.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.regularPrice) - Number(product.salePrice)) /
          Number(product.regularPrice)) *
          100,
      )
    : 0;

  const inStock = product.isInStock !== false;

  const shortDescription = stripHtml(product.shortDescription);

  return (
    <main className="min-h-screen bg-white">
      <div className="relative h-[140px] w-full overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />

        <div className="absolute left-1/2 top-1/2 h-[140px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03] blur-[90px]" />
      </div>
      {/* =========================
          BREADCRUMB
      ========================= */}

      <div className="mx-auto max-w-[1600px] px-5 pt-[30px] sm:px-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-black/35">
          <Link href="/" className="transition hover:text-black">
            وینگز
          </Link>

          <span>/</span>

          <Link href="/shop" className="transition hover:text-black">
            فروشگاه
          </Link>

          {category && (
            <>
              <span>/</span>

              {categorySlug ? (
                <Link
                  href={`/shop?category=${categorySlug}`}
                  className="transition hover:text-black"
                >
                  {category}
                </Link>
              ) : (
                <span>{category}</span>
              )}
            </>
          )}

          <span>/</span>

          <span className="text-black/60">{product.name}</span>
        </div>
      </div>

      {/* =========================
          PRODUCT
      ========================= */}

      <section className="mx-auto max-w-[1600px] px-5 pb-24 pt-8 sm:px-8 lg:pb-32">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 xl:gap-24">
          {/* =========================
              GALLERY
          ========================= */}

          <ProductGallery
            images={product.images}
            fallbackImage={product.image}
            productName={product.name}
          />

          {/* =========================
              PRODUCT INFORMATION
          ========================= */}

          <div className="relative">
            <div className="lg:sticky lg:top-[170px]">
              {/* META */}

              <div className="flex items-center justify-between gap-5">
                <span
                  className="
                    text-[10px]
                    tracking-[3px]
                    text-black/35
                  "
                >
                  {category ? category : "WINGS GALLERY"}
                </span>

                <div className="flex items-center gap-2 text-xs text-black/45">
                  <span
                    className={`
                      h-1.5 w-1.5
                      rounded-full

                      ${inStock ? "bg-emerald-500" : "bg-black/20"}
                    `}
                  />

                  {inStock ? "موجود در انبار" : "ناموجود"}
                </div>
              </div>

              {/* TITLE */}

              <h1
                className="
                  mt-6
                  font-serif
                  text-4xl
                  leading-[1.35]
                  text-black
                  sm:text-5xl
                  lg:text-[54px]
                "
              >
                {product.name}
              </h1>

              {/* SKU */}

              {product.sku && (
                <p
                  dir="ltr"
                  className="
                    mt-3
                    text-right
                    text-[10px]
                    tracking-[1.5px]
                    text-black/25
                  "
                >
                  SKU: {product.sku}
                </p>
              )}

              {/* SHORT DESCRIPTION */}

              {shortDescription && (
                <p
                  className="
                    mt-7
                    max-w-xl
                    text-sm
                    leading-8
                    text-black/50
                    sm:text-[15px]
                  "
                >
                  {shortDescription}
                </p>
              )}

              {/* PRICE */}

              <div className="mt-8 border-y border-black/[0.08] py-7">
                <div className="flex flex-wrap items-end justify-between gap-5">
                  <div>
                    {hasDiscount ? (
                      <>
                        <div className="flex flex-wrap items-baseline gap-3">
                          <span className="text-2xl font-semibold tracking-tight text-black">
                            {persianNumber(currentPrice)}

                            <small className="mr-1.5 text-xs font-normal text-black/40">
                              تومان
                            </small>
                          </span>

                          <span className="text-sm text-black/25 line-through">
                            {persianNumber(product.regularPrice!)}
                          </span>
                        </div>

                        <p className="mt-2 text-[11px] text-black/40">
                          شما{" "}
                          {persianNumber(
                            Number(product.regularPrice) -
                              Number(product.salePrice),
                          )}{" "}
                          تومان کمتر پرداخت می‌کنید.
                        </p>
                      </>
                    ) : (
                      <span className="text-2xl font-semibold text-black">
                        {persianNumber(product.price)}

                        <small className="mr-1.5 text-xs font-normal text-black/40">
                          تومان
                        </small>
                      </span>
                    )}
                  </div>

                  {hasDiscount && (
                    <span className="rounded-full bg-black px-4 py-2 text-[10px] text-white">
                      SALE · ٪{persianNumber(discountPercent)}
                    </span>
                  )}
                </div>
              </div>

              {/* =========================
                  ATTRIBUTES
              ========================= */}

              {product.attributes && product.attributes.length > 0 && (
                <div className="mt-8">
                  <p className="text-xs font-medium text-black">مشخصات محصول</p>

                  <div className="mt-4 grid gap-3">
                    {product.attributes.map((attribute) => (
                      <div
                        key={attribute.name}
                        className="
                              flex
                              items-center
                              justify-between
                              gap-5

                              rounded-2xl
                              bg-black/[0.025]
                              px-5 py-4
                            "
                      >
                        <span className="text-xs text-black/40">
                          {attribute.name}
                        </span>

                        <div className="flex flex-wrap justify-end gap-2">
                          {attribute.options.map((option) => (
                            <span
                              key={option}
                              className="
                                      rounded-full
                                      bg-white
                                      px-3 py-1.5
                                      text-xs
                                      text-black/75
                                      shadow-[0_2px_10px_rgba(0,0,0,0.04)]
                                    "
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =========================
                  PURCHASE AREA
              ========================= */}

              <div className="mt-8">
                <button
                  type="button"
                  disabled={!inStock}
                  className={`
                    group
                    flex w-full
                    items-center
                    justify-between

                    rounded-full
                    px-7 py-5
                    text-sm

                    transition-all
                    duration-300

                    ${
                      inStock
                        ? `
                          bg-black
                          text-white
                          hover:scale-[1.01]
                          hover:bg-black/85
                        `
                        : `
                          cursor-not-allowed
                          bg-black/[0.06]
                          text-black/30
                        `
                    }
                  `}
                >
                  <span>
                    {inStock ? "افزودن به سبد خرید" : "در حال حاضر ناموجود"}
                  </span>

                  {inStock && (
                    <span
                      className="
                        flex h-9 w-9
                        items-center justify-center
                        rounded-full
                        bg-white
                        text-black
                        transition-transform
                        duration-300
                        group-hover:-translate-x-1
                      "
                    >
                      ←
                    </span>
                  )}
                </button>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-black/[0.07] px-4 py-4 text-center">
                    <p className="text-[10px] text-black/35">وضعیت</p>

                    <p className="mt-1.5 text-xs text-black/70">
                      {inStock ? "آماده سفارش" : "ناموجود"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-black/[0.07] px-4 py-4 text-center">
                    <p className="text-[10px] text-black/35">نوع محصول</p>

                    <p className="mt-1.5 text-xs text-black/70">
                      {product.hasOptions ? "دارای انتخاب" : "محصول ساده"}
                    </p>
                  </div>
                </div>
              </div>

              {/* RATING */}

              {Boolean(product.averageRating && product.averageRating > 0) && (
                <div className="mt-7 flex items-center justify-between border-t border-black/[0.08] pt-6">
                  <span className="text-xs text-black/40">نظر مشتریان</span>

                  <div dir="ltr" className="flex items-center gap-2">
                    <span className="text-sm">★</span>

                    <span className="text-xs">
                      {product.averageRating?.toFixed(1)}
                    </span>

                    {Boolean(product.reviewCount) && (
                      <span className="text-[10px] text-black/35">
                        ({persianNumber(product.reviewCount!)})
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          DESCRIPTION
      ========================= */}

      {product.description && (
        <section className="border-t border-black/[0.08] bg-[#fafafa]">
          <div
            className="
              mx-auto
              grid
              max-w-[1600px]
              gap-10
              px-5 py-20

              sm:px-8
              sm:py-24

              lg:grid-cols-[0.7fr_1.3fr]
              lg:gap-20
              lg:py-32
            "
          >
            <div>
              <p dir="ltr" className="text-[10px] tracking-[4px] text-black/30">
                PRODUCT STORY
              </p>

              <h2
                className="
                  mt-5
                  font-serif
                  text-4xl
                  leading-[1.3]
                  sm:text-5xl
                "
              >
                درباره
                <br />
                <span className="italic text-black/30">{product.name}</span>
              </h2>
            </div>

            <div
              className="
                max-w-3xl
                text-sm
                leading-9
                text-black/55

                [&_p]:mb-6
                [&_p:last-child]:mb-0

                sm:text-[15px]
                sm:leading-10
              "
              dangerouslySetInnerHTML={{
                __html: product.description,
              }}
            />
          </div>
        </section>
      )}

      {/* =========================
          PRODUCT DETAILS
      ========================= */}

      <section className="border-t border-black/[0.07]">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 lg:py-20">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="border-b border-black/[0.08] pb-7 md:border-b-0 md:border-l md:pl-8">
              <span className="text-[10px] text-black/30">01</span>

              <h3 className="mt-5 text-lg">انتخاب با جزئیات</h3>

              <p className="mt-3 text-xs leading-7 text-black/45">
                اطلاعات و ویژگی‌های محصول مستقیماً از مشخصات ثبت‌شده در فروشگاه
                وینگز نمایش داده می‌شوند.
              </p>
            </div>

            <div className="border-b border-black/[0.08] pb-7 md:border-b-0 md:border-l md:px-8">
              <span className="text-[10px] text-black/30">02</span>

              <h3 className="mt-5 text-lg">موجودی واقعی</h3>

              <p className="mt-3 text-xs leading-7 text-black/45">
                وضعیت موجودی این محصول با اطلاعات فروشگاه هماهنگ است.
              </p>
            </div>

            <div className="md:pr-8">
              <span className="text-[10px] text-black/30">03</span>

              <h3 className="mt-5 text-lg">داستان هر قطعه</h3>

              <p className="mt-3 text-xs leading-7 text-black/45">
                هر انتخاب در وینگز بخشی از استایل و داستان شخصی شماست.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
