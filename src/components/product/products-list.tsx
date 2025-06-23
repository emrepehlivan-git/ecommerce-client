import { ProductInfiniteScroll } from "./product-infinite-scroll";

export async function FeaturedProducts() {
  return (
    <div className="mb-12">
      <ProductInfiniteScroll initialPageSize={10} />
    </div>
  );
} 