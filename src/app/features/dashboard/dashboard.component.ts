import { Component, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Metric {
  label: string;
  value: string;
  change: number;
  icon: string;
  color: string;
}

interface RecentActivity {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Using signals for reactive state
  metrics = signal<Metric[]>([]);
  recentActivities = signal<RecentActivity[]>([]);
  
  // Expose Math for template
  Math = Math;
  
  ngOnInit(): void {
    this.loadMetrics();
    this.loadRecentActivities();
  }
  
  private loadMetrics(): void {
    this.metrics.set([
      {
        label: 'Total Revenue',
        value: '$45,231',
        change: 12.5,
        icon: '💰',
        color: 'var(--color-success)'
      },
      {
        label: 'Active Users',
        value: '8,432',
        change: 8.2,
        icon: '👥',
        color: 'var(--color-accent-cyan)'
      },
      {
        label: 'Orders Today',
        value: '234',
        change: -3.1,
        icon: '📦',
        color: 'var(--color-warning)'
      },
      {
        label: 'Avg Response',
        value: '420ms',
        change: 15.7,
        icon: '⚡',
        color: 'var(--color-accent-gold)'
      }
    ]);
  }
  
  private loadRecentActivities(): void {
    const activities: RecentActivity[] = [
      {
        id: '1',
        type: 'order',
        message: 'New order #1234 received from customer',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        icon: '🛒'
      },
      {
        id: '2',
        type: 'user',
        message: 'New user registration: john.doe@example.com',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        icon: '👤'
      },
      {
        id: '3',
        type: 'performance',
        message: 'Lighthouse score improved to 89 (was 52)',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        icon: '🚀'
      },
      {
        id: '4',
        type: 'deployment',
        message: 'New version deployed successfully',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        icon: '✅'
      },
      {
        id: '5',
        type: 'analytics',
        message: 'Weekly report generated and sent',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        icon: '📊'
      }
    ];
    
    this.recentActivities.set(activities);
  }
  
  formatTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  }
  
  // TrackBy functions for performance
  trackByLabel(index: number, item: Metric): string {
    return item.label;
  }
  
  trackById(index: number, item: RecentActivity): string {
    return item.id;
  }
}
