import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import "server-only";

if (process.env.NODE_ENV === "production" && !process.env.WC_API_URL?.startsWith("https://")) {
  throw new Error("WC_API_URL must use HTTPS");
}

const woo = new WooCommerceRestApi({
  url: process.env.WC_API_URL?.replace(/\/wp-json\/wc\/v\d+\/?$/, "").replace(/\/$/, "") || "",
  consumerKey: process.env.WC_CONSUMER_KEY!,
  consumerSecret: process.env.WC_CONSUMER_SECRET!,
  version: "wc/v3",
  timeout: 15000,
  axiosConfig: { maxRedirects: 0, maxContentLength: 10 * 1024 * 1024 },
});

export default woo;
