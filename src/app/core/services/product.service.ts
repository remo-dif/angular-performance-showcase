import { computed, inject, Injectable } from "@angular/core";
import { ProductApiService } from "../../data/products/product-api.service";
import { Product } from "../../domain/products/product.model";
import { ProductCatalogService } from "./product-catalog.service";

export type { Product } from "../../domain/products/product.model";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private readonly productApi = inject(ProductApiService);
  private readonly catalog = inject(ProductCatalogService);

  private readonly productsResource = this.productApi.productsResource;
  private readonly fallbackProducts = this.catalog.getMockProducts();

  readonly products = computed(() => {
    if (this.productsResource.hasValue()) {
      return this.productsResource.value();
    }

    return this.productsResource.status() === "error" ? this.fallbackProducts : [];
  });

  readonly loading = this.productsResource.isLoading;

  readonly error = computed(() =>
    this.productsResource.status() === "error" ? "Failed to load products" : null,
  );

  readonly categories = computed(() => this.catalog.getCategories(this.products()));

  getFilteredProducts(searchQuery: string, selectedCategory: string): Product[] {
    const categoryProducts = this.catalog.filterByCategory(
      this.products(),
      selectedCategory,
    );

    return this.catalog.searchProducts(categoryProducts, searchQuery);
  }

  getProductById(id: string): Product | undefined {
    return this.catalog.getProductById(this.products(), id);
  }

  clearCache(): void {
    this.productsResource.reload();
  }
}
