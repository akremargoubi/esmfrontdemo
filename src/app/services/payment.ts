import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_PAYMENTS } from '../core/mock/mock-data';

let _payments: any[] = [...MOCK_PAYMENTS];

@Injectable({ providedIn: 'root' })
export class PaymentService {

  addPayment(payment: any): Observable<any> {
    const created = { ...payment, id: Math.max(0, ..._payments.map(p => p.id)) + 1, date: new Date().toISOString() };
    _payments = [..._payments, created];
    return of(created).pipe(delay(400));
  }

  getAllPayments(): Observable<any[]> { return of([..._payments]).pipe(delay(250)); }
  getAll(): Observable<any[]> { return of([..._payments]).pipe(delay(250)); }

  update(id: number, payment: any): Observable<any> {
    const updated = { ...payment, id };
    _payments = _payments.map(p => p.id === id ? updated : p);
    return of(updated).pipe(delay(400));
  }

  delete(id: number): Observable<any> {
    _payments = _payments.filter(p => p.id !== id);
    return of({ status: 204 }).pipe(delay(300));
  }

  getByStudentEmail(email: string): Observable<any[]> {
    return of(_payments.filter(p => p.studentEmail === email || p.studentName?.toLowerCase().includes(email.split('@')[0]))).pipe(delay(200));
  }

  getByStudentId(studentId: string | number): Observable<any[]> {
    return of(_payments.filter(p => String(p.studentId) === String(studentId))).pipe(delay(200));
  }

  topupWallet(userId: string | number, amount: number): Observable<any> {
    return of({ walletBalance: amount, userId }).pipe(delay(500));
  }
}
