import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const woo = new WooCommerceRestApi({
  url: process.env.WC_API_URL!,
  consumerKey: process.env.WC_CONSUMER_KEY!,
  consumerSecret: process.env.WC_CONSUMER_SECRET!,
  version: "wc/v3",
});

export default woo;
