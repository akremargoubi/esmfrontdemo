import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { MOCK_ENROLLMENTS } from '../core/mock/mock-data';

export interface Enrollment {
  id?: number; userId?: number; userUuid?: string; studentId?: number;
  studentName?: string; courseId: number; courseName?: string;
  status?: string; enrolledAt?: string; completedAt?: string; progressPercent?: number; progress?: number;
}

let _enrollments: Enrollment[] = [...MOCK_ENROLLMENTS];

@Injectable({ providedIn: 'root' })
export class EnrollmentService {

  getEnrollments(): Observable<Enrollment[]> { return of([..._enrollments]).pipe(delay(250)); }

  getEnrollmentCountByCourse(): Observable<Map<number, number>> {
    return of([..._enrollments]).pipe(
      delay(200),
      map(list => {
        const m = new Map<number, number>();
        list.forEach(e => m.set(e.courseId, (m.get(e.courseId) ?? 0) + 1));
        return m;
      })
    );
  }

  getEnrollment(id: number): Observable<Enrollment> {
    return of(_enrollments.find(e => e.id === id) ?? _enrollments[0]).pipe(delay(200));
  }

  createEnrollment(e: Enrollment): Observable<Enrollment> {
    const created = { ...e, id: Math.max(0, ..._enrollments.map(x => x.id ?? 0)) + 1, enrolledAt: new Date().toISOString(), status: 'ACTIVE', progress: 0 };
    _enrollments = [..._enrollments, created];
    return of(created).pipe(delay(400));
  }

  getMyCourses(userId: string): Observable<any[]> {
    const numId = parseInt(userId, 10);
    const myEnrollments = _enrollments.filter(e => e.studentId === numId || String(e.userId) === userId);
    return of(myEnrollments).pipe(delay(250));
  }

  getEnrollmentHistory(userId: string): Observable<Enrollment[]> { return this.getEnrollmentsByUser(userId); }

  getEnrollmentsByUser(userId: string): Observable<Enrollment[]> {
    const numId = parseInt(userId, 10);
    return of(_enrollments.filter(e => e.studentId === numId || String(e.userId) === userId)).pipe(delay(200));
  }

  cancelEnrollment(id: number): Observable<Enrollment> {
    _enrollments = _enrollments.map(e => e.id === id ? { ...e, status: 'CANCELLED' } : e);
    return of(_enrollments.find(e => e.id === id)!).pipe(delay(300));
  }

  updateEnrollment(id: number, e: Enrollment): Observable<Enrollment> {
    const updated = { ...e, id };
    _enrollments = _enrollments.map(x => x.id === id ? updated : x);
    return of(updated).pipe(delay(400));
  }

  deleteEnrollment(id: number): Observable<void> {
    _enrollments = _enrollments.filter(e => e.id !== id);
    return of(undefined).pipe(delay(300));
  }
}
