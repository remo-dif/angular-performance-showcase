import { Injectable } from "@angular/core";
import { Product } from "../../domain/products/product.model";

@Injectable({
  providedIn: "root",
})
export class ProductCatalogService {
  searchProducts(products: readonly Product[], query: string): Product[] {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [...products];
    }

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery),
    );
  }

  filterByCategory(products: readonly Product[], category: string): Product[] {
    if (category === "all") {
      return [...products];
    }

    return products.filter((product) => product.category === category);
  }

  getCategories(products: readonly Product[]): string[] {
    return Array.from(new Set(products.map((product) => product.category))).sort();
  }

  getProductById(products: readonly Product[], id: string): Product | undefined {
    return products.find((product) => product.id === id);
  }

  getMockProducts(): Product[] {
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
}
