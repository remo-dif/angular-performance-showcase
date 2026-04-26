import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";

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
  private readonly apiUrl = "/api/products"; // In production, use environment variable
  private readonly productsCache$ = new BehaviorSubject<Product[] | null>(null);

  // Using signals for reactive state (Angular 17+)
  readonly products = signal<Product[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  /**
   * Get all products with caching
   * Uses shareReplay to prevent duplicate API calls
   */
  getProducts(): Observable<Product[]> {
    // Return cached observable if available
    if (this.productsCache$.value) {
      return of(this.productsCache$.value);
    }

    this.loading.set(true);
    this.error.set(null);

    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap((products) => {
        this.products.set(products);
        this.productsCache$.next(products);
        this.loading.set(false);
      }),
      catchError((error) => {
        this.error.set("Failed to load products");
        this.loading.set(false);
        // Return mock data for demo purposes
        const mockProducts = this.getMockProducts();
        this.products.set(mockProducts);
        this.productsCache$.next(mockProducts);
        return of(mockProducts);
      }),
      shareReplay(1), // Share the response with multiple subscribers
    );
  }

  /**
   * Get product by ID
   */
  getProductById(id: string): Observable<Product | undefined> {
    if (this.productsCache$.value) {
      const product = this.productsCache$.value.find((p) => p.id === id);
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
        price: Math.floor(Math.random() * 1000) + 10,
        category: categories[Math.floor(Math.random() * categories.length)],
        stock: Math.floor(Math.random() * 100),
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
    this.productsCache$.next(null);
    this.products.set([]);
  }
}
