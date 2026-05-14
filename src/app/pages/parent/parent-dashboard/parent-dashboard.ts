import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { MOCK_PARENT_CHILDREN, MOCK_PAYMENTS } from '../../../core/mock/mock-data';

@Component({
  selector: 'app-parent-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, DecimalPipe],
  templateUrl: './parent-dashboard.html',
  styleUrls: ['./parent-dashboard.css']
})
export class ParentDashboard implements OnInit {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  parentName = '';
  children: any[] = [];
  recentPayments: any[] = [];
  loading = true;

  showTopupModal = false;
  selectedChild: any = null;
  topupAmount: number | null = null;
  topupError = '';
  submitting = false;

  ngOnInit(): void {
    this.parentName = this.auth.getFullName();
    const userId = this.auth.getUserId() ?? '4';

    // Load children
    this.children = [...(MOCK_PARENT_CHILDREN[userId] ?? MOCK_PARENT_CHILDREN['4'] ?? [])];

    // Recent payments for this parent's children
    const childIds = new Set(this.children.map(c => c.id));
    this.recentPayments = MOCK_PAYMENTS
      .filter(p => childIds.has(p.studentId))
      .slice(0, 4);

    this.loading = false;
    this.cdr.detectChanges();
  }

  openTopup(child: any): void {
    this.selectedChild = { ...child };
    this.topupAmount = null;
    this.topupError = '';
    this.showTopupModal = true;
  }

  closeTopup(): void {
    this.showTopupModal = false;
    this.selectedChild = null;
  }

  confirmTopup(): void {
    if (!this.topupAmount || this.topupAmount <= 0) {
      this.topupError = 'Please enter a valid amount.';
      return;
    }
    this.submitting = true;
    this.topupError = '';

    // Simulate processing
    setTimeout(() => {
      const childInList = this.children.find(c => c.id === this.selectedChild.id);
      if (childInList) {
        childInList.walletBalance = (childInList.walletBalance ?? 0) + (this.topupAmount ?? 0);
      }
      const name = this.selectedChild.firstName;
      const amount = this.topupAmount;
      this.submitting = false;
      this.showTopupModal = false;
      this.selectedChild = null;
      this.topupAmount = null;
      this.toast.success(`Added ${amount} TND to ${name}'s wallet!`);
      this.cdr.detectChanges();
    }, 700);
  }

  getStatusClass(status: string): string {
    return { PAID: 'badge-paid', PENDING: 'badge-pending', OVERDUE: 'badge-overdue' }[status] ?? '';
  }
}
