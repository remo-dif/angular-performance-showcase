import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush, // Performance optimization
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  readonly sidebarCollapsed = signal(false);

  readonly navItems: readonly NavItem[] = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/products", label: "Products", icon: "📦" },
    { path: "/analytics", label: "Analytics", icon: "📈" },
    { path: "/orders", label: "Orders", icon: "🛒" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
  ];

  toggleSidebar(): void {
    this.sidebarCollapsed.update((collapsed) => !collapsed);
  }
}
