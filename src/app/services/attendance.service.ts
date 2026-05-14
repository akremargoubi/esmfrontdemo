import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_ATTENDANCE } from '../core/mock/mock-data';

export interface Attendance {
  id?: number;
  attended?: number;
  studentId?: number;
  studentName?: string;
  studentEmail?: string;
  courseId?: number;
  courseName?: string;
  className?: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

let _attendance: Attendance[] = [...MOCK_ATTENDANCE] as Attendance[];

@Injectable({ providedIn: 'root' })
export class AttendanceService {

  getAll(): Observable<Attendance[]> { return of([..._attendance]).pipe(delay(250)); }

  getById(id: number): Observable<Attendance> {
    return of(_attendance.find(a => a.id === id) ?? _attendance[0]).pipe(delay(200));
  }

  getByStudentEmail(email: string): Observable<Attendance[]> {
    return of(_attendance.filter(a => a.studentEmail === email)).pipe(delay(200));
  }

  getByCourse(courseId: number): Observable<Attendance[]> {
    return of(_attendance.filter(a => a.courseId === courseId)).pipe(delay(200));
  }

  getByStudentAndCourse(email: string, courseId: number): Observable<Attendance[]> {
    return of(_attendance.filter(a => a.studentEmail === email && a.courseId === courseId)).pipe(delay(200));
  }

  create(a: Attendance): Observable<Attendance> {
    const created = { ...a, id: Math.max(0, ..._attendance.map(x => x.id ?? 0)) + 1 };
    _attendance = [..._attendance, created];
    return of(created).pipe(delay(400));
  }

  update(id: number, a: Attendance): Observable<Attendance> {
    const updated = { ...a, id };
    _attendance = _attendance.map(x => x.id === id ? updated : x);
    return of(updated).pipe(delay(400));
  }

  delete(id: number): Observable<void> {
    _attendance = _attendance.filter(a => a.id !== id);
    return of(undefined).pipe(delay(300));
  }
}
