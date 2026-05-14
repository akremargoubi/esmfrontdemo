import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_PLANNING, MOCK_ASSESSMENTS } from '../core/mock/mock-data';
import { Assessment } from './assessment.service';

@Injectable({ providedIn: 'root' })
export class PlanningService {

  getCalendar(_year: number, _month: number): Observable<any[]> {
    return of([...MOCK_PLANNING, ...MOCK_ASSESSMENTS.filter(a => a.startDate)]).pipe(delay(250));
  }

  getUpcoming(): Observable<Assessment[]> {
    const now = Date.now();
    return of(MOCK_ASSESSMENTS.filter(a => a.startDate && new Date(a.startDate).getTime() > now) as Assessment[]).pipe(delay(200));
  }

  getOngoing(): Observable<Assessment[]> {
    const now = Date.now();
    return of(MOCK_ASSESSMENTS.filter(a =>
      a.startDate && a.endDate &&
      new Date(a.startDate).getTime() <= now &&
      new Date(a.endDate).getTime() >= now
    ) as Assessment[]).pipe(delay(200));
  }

  getAll(): Observable<any[]> {
    return of([...MOCK_PLANNING]).pipe(delay(250));
  }
}
