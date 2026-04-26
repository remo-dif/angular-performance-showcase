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
  constructor(public readonly productService: ProductService) {}

  // State management with signals
  readonly searchQuery = signal("");
  readonly selectedCategory = signal("all");

  readonly allProducts = signal<Product[]>([]);

  // Computed signals for filtering
  readonly filteredProducts = computed(() => {
    let products = this.allProducts();
    const selectedCategory = this.selectedCategory();
    const searchQuery = this.searchQuery().trim().toLowerCase();

    // Filter by category
    if (selectedCategory !== "all") {
      products = products.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery) ||
          p.description.toLowerCase().includes(searchQuery),
      );
    }

    return products;
  });

  readonly categories = computed(() => {
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

  trackById(index: number, item: Product): string {
    return item.id;
  }
}
