import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../services/payment';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.html',
  styleUrl: './payments.css'
})
export class Payments implements OnInit, OnDestroy {

  payments: any[] = [];
  searchTerm = '';
  selectedStatus = '';
  selectedMethod = '';
  readonly pageSize = 8;
  currentPage = 1;
  editingPayment: any = null;
  private destroy$ = new Subject<void>();

  // KPI summaries
  totalRevenue = 0;
  paidRevenue = 0;
  pendingRevenue = 0;
  overdueRevenue = 0;
  paidCount = 0;
  pendingCount = 0;
  overdueCount = 0;

  constructor(
    private paymentService: PaymentService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd), takeUntil(this.destroy$))
      .subscribe((e) => {
        if (e.urlAfterRedirects.includes('/payments')) this.loadPayments();
      });
  }

  ngOnInit(): void { this.loadPayments(); }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  loadPayments(): void {
    this.paymentService.getAll().subscribe({
      next: (data) => {
        this.payments = Array.isArray(data) ? [...data] : [];
        this.computeKpis();
        this.cdr.detectChanges();
      },
      error: () => { this.payments = []; this.cdr.detectChanges(); }
    });
  }

  computeKpis(): void {
    const paid    = this.payments.filter(p => p.status === 'PAID');
    const pending = this.payments.filter(p => p.status === 'PENDING');
    const overdue = this.payments.filter(p => p.status === 'OVERDUE');
    this.paidRevenue    = paid.map(p => p.amount).reduce((a, b) => a + b, 0);
    this.pendingRevenue = pending.map(p => p.amount).reduce((a, b) => a + b, 0);
    this.overdueRevenue = overdue.map(p => p.amount).reduce((a, b) => a + b, 0);
    this.totalRevenue   = this.payments.map(p => p.amount).reduce((a, b) => a + b, 0);
    this.paidCount    = paid.length;
    this.pendingCount = pending.length;
    this.overdueCount = overdue.length;
  }

  startEditPayment(p: any): void {
    this.editingPayment = {
      id: p.id,
      amount: p.amount,
      method: p.method,
      status: p.status,
      date: p.date ? p.date.toString().slice(0, 10) : ''
    };
  }

  cancelEditPayment(): void { this.editingPayment = null; }

  savePayment(): void {
    if (!this.editingPayment) return;
    const id = this.editingPayment.id;
    const payload = { ...this.editingPayment, date: this.editingPayment.date ? this.editingPayment.date + 'T00:00:00' : null };
    this.paymentService.update(id, payload).subscribe({
      next: (updated) => {
        const idx = this.payments.findIndex(x => x.id === id);
        if (idx !== -1) this.payments[idx] = { ...this.payments[idx], ...updated };
        this.editingPayment = null;
        this.computeKpis();
        this.cdr.detectChanges();
      },
      error: () => alert('Failed to update payment.')
    });
  }

  deletePayment(id: number): void {
    this.paymentService.delete(id).subscribe(() => {
      this.payments = this.payments.filter(p => p.id !== id);
      this.currentPage = Math.min(this.currentPage, Math.max(1, this.totalPagesPayment));
      this.computeKpis();
      this.cdr.detectChanges();
    });
  }

  get filteredPayments(): any[] {
    return this.payments.filter(p => {
      const q = this.searchTerm.toLowerCase();
      const matchesSearch = !q
        || String(p.id).includes(q)
        || (p.studentName && p.studentName.toLowerCase().includes(q))
        || (p.description && p.description.toLowerCase().includes(q))
        || (p.method && p.method.toLowerCase().includes(q));
      const matchesStatus = !this.selectedStatus || p.status === this.selectedStatus;
      const matchesMethod = !this.selectedMethod || p.method === this.selectedMethod;
      return matchesSearch && matchesStatus && matchesMethod;
    });
  }

  get totalPagesPayment(): number {
    const len = this.filteredPayments.length;
    return len === 0 ? 1 : Math.ceil(len / this.pageSize);
  }

  get paginatedPayments(): any[] {
    const list = this.filteredPayments;
    const start = (this.currentPage - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  }

  goToPagePayment(page: number): void {
    this.currentPage = Math.max(1, Math.min(page, this.totalPagesPayment));
  }

  exportPdf(): void {
    const rows = this.filteredPayments.map(p => [
      String(p.id ?? ''),
      p.studentName ?? '—',
      p.description ?? '—',
      String(p.amount ?? '') + ' TND',
      String(p.method ?? ''),
      String(p.status ?? ''),
      p.dueDate ? new Date(p.dueDate).toLocaleDateString() : '—'
    ]);
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Payments Report — Fluencity', 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}  |  Total: ${this.totalRevenue} TND  |  Paid: ${this.paidRevenue} TND`, 14, 28);
    autoTable(doc, {
      head: [['#', 'Student', 'Description', 'Amount', 'Method', 'Status', 'Due Date']],
      body: rows,
      startY: 34
    });
    doc.save('payments.pdf');
  }
}
