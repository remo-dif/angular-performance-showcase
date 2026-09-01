import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, finalize, map, shareReplay, tap } from "rxjs/operators";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  description: string;
}

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = "/api/products";
  private productsCache: Product[] | null = null;
  private productsRequest$?: Observable<Product[]>;

  private readonly productsState = signal<Product[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly products = this.productsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  /**
   * Get all products with caching
   * Uses shareReplay to prevent duplicate API calls
   */
  getProducts(): Observable<Product[]> {
    if (this.productsCache) {
      return of(this.productsCache);
    }

    if (this.productsRequest$) {
      return this.productsRequest$;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    this.productsRequest$ = this.http.get<Product[]>(this.apiUrl).pipe(
      tap((products) => {
        this.productsState.set(products);
        this.productsCache = products;
      }),
      catchError(() => {
        this.errorState.set("Failed to load products");
        const mockProducts = this.getMockProducts();
        this.productsState.set(mockProducts);
        this.productsCache = mockProducts;
        return of(mockProducts);
      }),
      finalize(() => {
        this.loadingState.set(false);
        this.productsRequest$ = undefined;
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    return this.productsRequest$;
  }

  /**
   * Get product by ID
   */
  getProductById(id: string): Observable<Product | undefined> {
    if (this.productsCache) {
      const product = this.productsCache.find((p) => p.id === id);
      return of(product);
    }

    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const mockProduct = this.getMockProducts().find((p) => p.id === id);
        return of(mockProduct);
      }),
    );
  }

  /**
   * Search products (client-side for demo)
   */
  searchProducts(query: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map((products) =>
        products.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()),
        ),
      ),
    );
  }

  /**
   * Filter products by category
   */
  filterByCategory(category: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map((products) =>
        category === "all"
          ? products
          : products.filter((p) => p.category === category),
      ),
    );
  }

  /**
   * Get mock products for demo (simulates API response)
   */
  private getMockProducts(): Product[] {
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

  /**
   * Clear cache manually
   */
  clearCache(): void {
    this.productsCache = null;
    this.productsState.set([]);
    this.errorState.set(null);
  }
}
