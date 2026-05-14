import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_COURSES } from '../core/mock/mock-data';

@Injectable({ providedIn: 'root' })
export class CourseService {
  getAll(): Observable<any[]> {
    return of([...MOCK_COURSES]).pipe(delay(200));
  }

  getById(id: number): Observable<any> {
    return of(MOCK_COURSES.find(c => c.courseId === id) ?? MOCK_COURSES[0]).pipe(delay(200));
  }
}
