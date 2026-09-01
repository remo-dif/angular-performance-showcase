import { httpResource } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Product } from "../../domain/products/product.model";

@Injectable({
  providedIn: "root",
})
export class ProductApiService {
  private readonly apiUrl = "/api/products";

  readonly productsResource = httpResource<Product[]>(() => this.apiUrl, {
    debugName: "ProductApiService.products",
  });
}
