export const config = {

 wordpress:{
  url: process.env.WP_API_URL
 },

 woocommerce:{
  url: process.env.WC_API_URL,
  key:process.env.WC_CONSUMER_KEY,
  secret:process.env.WC_CONSUMER_SECRET
 },

 sms:{
  provider:process.env.SMS_PROVIDER
 },

 payment:{
  provider:process.env.PAYMENT_PROVIDER
 }

}