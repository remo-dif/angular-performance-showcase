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
}
