import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_ASSESSMENTS } from '../core/mock/mock-data';

export interface Assessment {
  id?: number;
  title: string;
  courseName: string;
  type: string;
  status: string;
  className?: string;
  startDate?: string;
  endDate?: string;
  duration?: number;
}

let _assessments: Assessment[] = [...MOCK_ASSESSMENTS];

@Injectable({ providedIn: 'root' })
export class AssessmentService {

  getAll(): Observable<Assessment[]> {
    return of([..._assessments]).pipe(delay(250));
  }

  getById(id: number): Observable<Assessment> {
    return of(_assessments.find(a => a.id === id) ?? _assessments[0]).pipe(delay(200));
  }

  getByClassName(className: string): Observable<Assessment[]> {
    return of(_assessments.filter(a => a.className === className)).pipe(delay(200));
  }

  create(a: Assessment): Observable<Assessment> {
    const created = { ...a, id: Math.max(0, ..._assessments.map(x => x.id ?? 0)) + 1 };
    _assessments = [..._assessments, created];
    return of(created).pipe(delay(400));
  }

  update(id: number, a: Assessment): Observable<Assessment> {
    const updated = { ...a, id };
    _assessments = _assessments.map(x => x.id === id ? updated : x);
    return of(updated).pipe(delay(400));
  }

  delete(id: number): Observable<{ status: number }> {
    _assessments = _assessments.filter(x => x.id !== id);
    return of({ status: 204 }).pipe(delay(300));
  }

  getTypes(): Observable<string[]> { return of(['EXAM', 'QUIZ', 'PROJECT']); }
  getStatuses(): Observable<string[]> { return of(['DRAFT', 'PUBLISHED', 'CLOSED']); }
}
