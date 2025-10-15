import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Product | SAADiCcollection.shop",
  description: "Add new products to your store. Manage product details, pricing, and inventory on SAADiCcollection.shop.",
  keywords: ["create product", "add product", "seller dashboard", "inventory management", "SAADiCcollection.shop"],
};


export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   
        
          <main className="">{children}</main>
 
     
  );
}
