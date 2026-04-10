import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * A customizable button component with multiple variants
 */
@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="'btn btn-' + variant + ' btn-' + size"
      (click)="handleClick($event)"
      [attr.aria-label]="ariaLabel"
      [attr.aria-busy]="loading">
      <span *ngIf="loading" class="spinner"></span>
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #2563eb;
    }

    .btn-secondary {
      background-color: #6b7280;
      color: white;
    }

    .btn-danger {
      background-color: #ef4444;
      color: white;
    }

    .btn-sm {
      padding: 0.25rem 0.75rem;
      font-size: 0.875rem;
    }

    .btn-md {
      padding: 0.5rem 1rem;
      font-size: 1rem;
    }

    .btn-lg {
      padding: 0.75rem 1.5rem;
      font-size: 1.125rem;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .spinner {
      width: 1rem;
      height: 1rem;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ButtonComponent {
  /** Button variant/color scheme */
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';

  /** Button size */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  /** Button type attribute */
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  /** Disabled state */
  @Input() disabled: boolean = false;

  /** Loading state - shows spinner */
  @Input() loading: boolean = false;

  /** ARIA label for accessibility */
  @Input() ariaLabel: string = '';

  /** Emitted when button is clicked */
  @Output() btnClick = new EventEmitter<MouseEvent>();

  handleClick(event: MouseEvent) {
    if (!this.disabled && !this.loading) {
      this.btnClick.emit(event);
    }
  }
}
