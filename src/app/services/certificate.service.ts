import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_CERTIFICATES } from '../core/mock/mock-data';

export interface CertificateResponse {
  certificateId: string; studentName: string; examTitle: string;
  score: number; downloadUrl: string; generatedAt: string;
  certificateNumber?: string; level?: string; grade?: string;
}

let _certificates = [...MOCK_CERTIFICATES];

@Injectable({ providedIn: 'root' })
export class CertificateService {

  getByStudent(studentId: number | string): Observable<any[]> {
    return of(_certificates.filter(c => String(c.studentId) === String(studentId))).pipe(delay(250));
  }

  getAll(): Observable<any[]> { return of([..._certificates]).pipe(delay(250)); }

  generateCertificate(data: { studentName: string; studentEmail: string; examTitle: string; score: number; maxScore: number; passedAt: string }): Observable<CertificateResponse> {
    const cert: CertificateResponse = {
      certificateId: `ESM-${Date.now()}`,
      studentName: data.studentName,
      examTitle: data.examTitle,
      score: data.score,
      downloadUrl: '#',
      generatedAt: new Date().toISOString(),
      certificateNumber: `ESM-2025-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    };
    return of(cert).pipe(delay(800));
  }

  downloadCertificate(_certificateId: string): void {
    // Mock: show alert in demo mode instead of opening URL
    alert('Certificate download is simulated in demo mode.');
  }
}
