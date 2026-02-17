import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Product, ProductService } from "../../core/services/product.service";

@Component({
  selector: "app-products",
  standalone: true,
  imports: [CommonModule, ScrollingModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent implements OnInit {
  // Inject service
  constructor(public productService: ProductService) {}

  // State management with signals
  searchQuery = "";
  selectedCategory = "all";

  allProducts = signal<Product[]>([]);

  // Computed signals for filtering
  filteredProducts = computed(() => {
    let products = this.allProducts();

    // Filter by category
    if (this.selectedCategory !== "all") {
      products = products.filter((p) => p.category === this.selectedCategory);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query),
      );
    }

    return products;
  });

  categories = computed(() => {
    const products = this.allProducts();
    return Array.from(new Set(products.map((p) => p.category))).sort();
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.allProducts.set(products);
      },
      error: (err) => {
        console.error("Failed to load products:", err);
      },
    });
  }

  onSearchChange(): void {
    // Trigger computed signal recalculation
    // Angular automatically handles this with signals
  }

  onCategoryChange(): void {
    // Trigger computed signal recalculation
  }

  // TrackBy for virtual scroll performance
  trackById(index: number, item: Product): string {
    return item.id;
  }
}
