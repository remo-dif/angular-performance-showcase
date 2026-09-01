import { ScrollingModule } from "@angular/cdk/scrolling";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Product, ProductService } from "../../core/services/product.service";

@Component({
  selector: "app-products",
  imports: [ScrollingModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./products.component.html",
  styleUrl: "./products.component.scss",
})
export class ProductsComponent {
  readonly productService = inject(ProductService);

  // State management with signals
  readonly searchQuery = signal("");
  readonly selectedCategory = signal("all");

  readonly filteredProducts = computed(() =>
    this.productService.getFilteredProducts(
      this.searchQuery(),
      this.selectedCategory(),
    ),
  );

  readonly categories = this.productService.categories;

  trackById(index: number, item: Product): string {
    return item.id;
  }
}
