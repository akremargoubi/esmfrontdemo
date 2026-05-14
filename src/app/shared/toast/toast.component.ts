import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" aria-live="polite">
      @for (toast of toastService.messages(); track toast.id) {
        <div class="toast-item toast-{{ toast.type }}" role="alert">
          <span class="toast-icon">
            @if (toast.type === 'success') { ✓ }
            @else if (toast.type === 'error') { ✕ }
            @else { ℹ }
          </span>
          <span class="toast-msg">{{ toast.message }}</span>
          <button class="toast-close" (click)="toastService.dismiss(toast.id)" aria-label="Dismiss">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      max-width: 380px;
      pointer-events: none;
    }
    .toast-item {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.875rem 1rem;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 500;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      pointer-events: all;
      animation: slideIn 0.25s ease-out;
      min-width: 280px;
    }
    .toast-success { background: #16a34a; color: white; }
    .toast-error   { background: #dc2626; color: white; }
    .toast-info    { background: #2563eb; color: white; }
    .toast-icon  { font-size: 1rem; flex-shrink: 0; font-weight: 700; }
    .toast-msg   { flex: 1; line-height: 1.4; }
    .toast-close { background: rgba(255,255,255,0.25); border: none; color: white; cursor: pointer; border-radius: 4px; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; padding: 0; transition: background 0.15s; }
    .toast-close:hover { background: rgba(255,255,255,0.4); }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
