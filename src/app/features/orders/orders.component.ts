import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";

// ORDERS COMPONENT
@Component({
  selector: "app-orders",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
})
export class OrdersComponent {}

// SETTINGS COMPONENT
@Component({
  selector: "app-settings",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">
      <h1>⚙️ Settings</h1>
      <p>Application configuration and preferences</p>
      <div class="placeholder">Lazy-loaded settings component</div>
    </div>
  `,
  styles: [
    `
      .page {
        max-width: 1400px;
        margin: 0 auto;
      }
      h1 {
        font-size: var(--text-4xl);
        margin-bottom: var(--space-sm);
      }
      p {
        color: var(--color-text-secondary);
        margin-bottom: var(--space-xl);
      }
      .placeholder {
        padding: var(--space-2xl);
        background: var(--color-bg-card);
        border-radius: var(--border-radius-lg);
        text-align: center;
        color: var(--color-text-muted);
      }
    `,
  ],
})
export class SettingsComponent {}

// NOT FOUND COMPONENT
@Component({
  selector: "app-not-found",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="not-found">
      <div class="error-code">404</div>
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/dashboard" class="home-link">← Back to Dashboard</a>
    </div>
  `,
  styles: [
    `
      .not-found {
        max-width: 600px;
        margin: var(--space-2xl) auto;
        text-align: center;
        padding: var(--space-2xl);
      }

      .error-code {
        font-size: 8rem;
        font-family: var(--font-display);
        font-weight: 700;
        background: linear-gradient(
          135deg,
          var(--color-accent-gold),
          var(--color-accent-cyan)
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        line-height: 1;
        margin-bottom: var(--space-lg);
      }

      h1 {
        font-size: var(--text-3xl);
        margin-bottom: var(--space-md);
      }

      p {
        color: var(--color-text-secondary);
        margin-bottom: var(--space-xl);
      }

      .home-link {
        display: inline-block;
        padding: var(--space-md) var(--space-xl);
        background: var(--color-accent-gold);
        color: var(--color-bg-primary);
        border-radius: var(--border-radius-md);
        font-weight: 600;
        text-decoration: none;
        transition: all var(--transition-base);

        &:hover {
          background: var(--color-accent-cyan);
          transform: translateY(-2px);
        }
      }
    `,
  ],
})
export class NotFoundComponent {}
