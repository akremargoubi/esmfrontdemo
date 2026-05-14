import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_CLASSES, MOCK_STUDENTS } from '../mock/mock-data';

export interface StudentSummary {
  id: string; firstName: string | null; lastName: string | null;
  email: string; cin?: string | null; avatarUrl?: string | null;
}

export interface ClassResponse {
  id: number; name: string; level: string | null; specialty: string | null;
  description?: string | null; createdAt?: string; tutorId?: string | null;
  tutorFirstName?: string | null; tutorLastName?: string | null; tutorEmail?: string | null;
  studentCount: number; students?: StudentSummary[];
}

export interface ClassCreateRequest { name: string; level?: string | null; specialty?: string | null; description?: string | null; tutorId?: string | null; }
export interface ClassUpdateRequest { name?: string; level?: string | null; specialty?: string | null; description?: string | null; tutorId?: string | null; }

let _classes: ClassResponse[] = MOCK_CLASSES.map(c => ({
  ...c, description: null, createdAt: new Date().toISOString(),
  tutorFirstName: c.tutorName.split(' ')[0],
  tutorLastName: c.tutorName.split(' ')[1] ?? '',
  tutorEmail: `${c.tutorName.toLowerCase().replace(' ', '.')}@fluencity.com`,
  students: MOCK_STUDENTS.filter(s => s.className === c.name).map(s => ({
    id: String(s.id), firstName: s.firstName, lastName: s.lastName, email: s.email,
  })),
}));

@Injectable({ providedIn: 'root' })
export class ClassService {

  listClasses(): Observable<ClassResponse[]> { return of([..._classes]).pipe(delay(250)); }

  getClass(id: number): Observable<ClassResponse> {
    return of(_classes.find(c => c.id === id) ?? _classes[0]).pipe(delay(200));
  }

  createClass(body: ClassCreateRequest): Observable<ClassResponse> {
    const created: ClassResponse = {
      id: Math.max(..._classes.map(c => c.id)) + 1,
      name: body.name, level: body.level ?? null, specialty: body.specialty ?? null,
      studentCount: 0, students: [], createdAt: new Date().toISOString(),
    };
    _classes = [..._classes, created];
    return of(created).pipe(delay(500));
  }

  updateClass(id: number, body: ClassUpdateRequest): Observable<ClassResponse> {
    _classes = _classes.map(c => c.id === id ? { ...c, ...body } : c);
    return of(_classes.find(c => c.id === id)!).pipe(delay(400));
  }

  deleteClass(id: number): Observable<void> {
    _classes = _classes.filter(c => c.id !== id);
    return of(undefined).pipe(delay(300));
  }

  assignStudent(classId: number, userId: string): Observable<ClassResponse> {
    return this.getClass(classId);
  }

  removeStudent(classId: number, userId: string): Observable<ClassResponse> {
    return this.getClass(classId);
  }

  assignTutor(classId: number, tutorId: string): Observable<ClassResponse> {
    return this.getClass(classId);
  }

  removeTutor(classId: number): Observable<ClassResponse> {
    return this.getClass(classId);
  }
}
