import { Product } from "../../domain/products/product.model";

export function createMockProducts(): Product[] {
  const categories = ["Electronics", "Clothing", "Home", "Sports", "Books"];
  const products: Product[] = [];

  for (let i = 1; i <= 100; i++) {
    products.push({
      id: `prod-${i}`,
      name: `Product ${i}`,
      price: ((i * 73) % 990) + 10,
      category: categories[i % categories.length],
      stock: (i * 17) % 100,
      image: `https://picsum.photos/seed/${i}/400/300`,
      description: `High-quality product ${i} with excellent features and reliability.`,
    });
  }

  return products;
}
