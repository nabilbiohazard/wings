import woo from "@/lib/woocommerce";
import { mapWooProduct } from "@/lib/woo-mapper";


export async function GET() {

  try {

    const response = await woo.get("products", {
      per_page: 12,
      status: "publish",
    });


    return Response.json({
      success:true,
      products:response.data.map(mapWooProduct)
    });


  } catch(error:any){

    return Response.json(
      {
        success:false,
        message:error.message
      },
      {
        status:500
      }
    );

  }

}