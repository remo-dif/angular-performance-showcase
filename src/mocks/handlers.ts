import { delay, http, HttpResponse } from "msw";
import { createMockProducts } from "../app/data/products/product.mock";

const products = createMockProducts();

export const handlers = [
  http.get("/api/products", async () => {
    await delay(350);

    return HttpResponse.json(products);
  }),

  http.get("/api/products/:id", ({ params }) => {
    const product = products.find(({ id }) => id === params["id"]);

    if (!product) {
      return HttpResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    return HttpResponse.json(product);
  }),
];
