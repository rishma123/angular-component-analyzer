import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span
      [class]="'badge badge-' + status + ' badge-' + size"
      [attr.aria-label]="label"
      (click)="handleClick()"
      [style.cursor]="clickable ? 'pointer' : 'default'">
      {{ label }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 0.5rem;
      font-weight: 500;
    }
    .badge-active { background: #10b981; color: white; }
    .badge-inactive { background: #6b7280; color: white; }
    .badge-pending { background: #f59e0b; color: white; }
    .badge-sm { font-size: 0.75rem; }
    .badge-md { font-size: 0.875rem; }
    .badge-lg { font-size: 1rem; }
  `]
})
export class StatusBadgeComponent {
  @Input() status: 'active' | 'inactive' | 'pending' = 'active';
  @Input() label: string = '';
  @Input() clickable: boolean = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  @Output() badgeClick = new EventEmitter<string>();

  handleClick() {
    if (this.clickable) {
      this.badgeClick.emit(this.status);
    }
  }
}
