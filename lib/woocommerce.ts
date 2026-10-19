import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import "server-only";

const woo = new WooCommerceRestApi({
  url: process.env.WC_API_URL?.replace(/\/wp-json\/wc\/v\d+\/?$/, "").replace(/\/$/, "") || "",
  consumerKey: process.env.WC_CONSUMER_KEY!,
  consumerSecret: process.env.WC_CONSUMER_SECRET!,
  version: "wc/v3",
});

export default woo;
