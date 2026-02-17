import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    title: 'Dashboard | Performance Showcase'
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/products.component')
      .then(m => m.ProductsComponent),
    title: 'Products | Performance Showcase',
    data: { preload: true, preloadDelay: 2000 } // Smart preloading
  },
  {
    path: 'analytics',
    loadComponent: () => import('./features/analytics/analytics.component')
      .then(m => m.AnalyticsComponent),
    title: 'Analytics | Performance Showcase',
    data: { preload: false } // Heavy charts - load on demand only
  },
  {
    path: 'orders',
    loadComponent: () => import('./features/orders/orders.component')
      .then(m => m.OrdersComponent),
    title: 'Orders | Performance Showcase'
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component')
      .then(m => m.SettingsComponent),
    title: 'Settings | Performance Showcase'
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component')
      .then(m => m.NotFoundComponent),
    title: '404 | Performance Showcase'
  }
];
