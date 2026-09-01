import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-orders",
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./orders.component.html",
  styleUrl: "./orders.component.scss",
})
export class OrdersComponent {}
