import type { Metadata } from "next";
import { INITIAL_PRODUCTS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import ProductDetailClient from "./product-detail-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} — ${formatCurrency(product.price)}`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default function ProductDetailPage() {
  return <ProductDetailClient />;
}
