import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_COURSES } from '../core/mock/mock-data';

export interface Course { courseId?: number; name: string; level: string; description?: string; categoryId?: number; instructorId?: number | string; instructorName?: string; price?: number; thumbnailUrl?: string; isPublished?: boolean; ratingAvg?: number; ratingCount?: number; enrollmentCount?: number; category?: string; }
export interface PageResponse<T> { content: T[]; page: number; size: number; totalElements: number; totalPages: number; first: boolean; last: boolean; }
export interface Category { id?: number; name: string; description?: string; slug?: string; }
export interface Instructor { id?: number; firstName: string; lastName: string; email?: string; bio?: string; avatarUrl?: string; }
export interface CourseSearchParams { search?: string; level?: string; categoryId?: number; instructorId?: number; isPublished?: boolean; minRating?: number; freeOnly?: boolean; sortBy?: string; sortDir?: string; page?: number; size?: number; }
export interface Module { id?: number; courseId?: number; title: string; lessons?: any[]; order?: number; }
export interface Review { id?: number; courseId?: number; studentName?: string; rating?: number; comment?: string; createdAt?: string; }

const CATEGORIES: Category[] = [
  { id: 1, name: 'General' }, { id: 2, name: 'Business' }, { id: 3, name: 'Exam' },
  { id: 4, name: 'Kids' }, { id: 5, name: 'Academic' },
];

const INSTRUCTORS: Instructor[] = [
  { id: 2, firstName: 'Sonia',  lastName: 'Ben Ali',  email: 'tutor@fluencity.com' },
  { id: 5, firstName: 'Omar',   lastName: 'Khelifi',  email: 'omar.k@fluencity.com' },
  { id: 6, firstName: 'Leila',  lastName: 'Amri',     email: 'leila.a@fluencity.com' },
];

let _courses: Course[] = [...MOCK_COURSES];

@Injectable({ providedIn: 'root' })
export class CoursesService {

  searchCourses(params: CourseSearchParams): Observable<PageResponse<Course>> {
    let data = [..._courses];
    if (params.search) data = data.filter(c => c.name.toLowerCase().includes(params.search!.toLowerCase()) || (c.description ?? '').toLowerCase().includes(params.search!.toLowerCase()));
    if (params.level) data = data.filter(c => c.level === params.level);
    if (params.minRating != null) data = data.filter(c => (c.ratingAvg ?? 0) >= params.minRating!);
    if (params.freeOnly === true) data = data.filter(c => !c.price || c.price === 0);
    if (params.freeOnly === false) data = data.filter(c => c.price && c.price > 0);
    if (params.sortBy === 'ratingAvg' || params.sortBy === 'popular') data = [...data].sort((a, b) => (b.ratingAvg ?? 0) - (a.ratingAvg ?? 0));
    else if (params.sortBy === 'price' && params.sortDir === 'asc') data = [...data].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    else if (params.sortBy === 'price') data = [...data].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    const page = params.page ?? 0; const size = params.size ?? 12;
    const content = data.slice(page * size, page * size + size);
    return of({ content, page, size, totalElements: data.length, totalPages: Math.ceil(data.length / size), first: page === 0, last: (page + 1) * size >= data.length }).pipe(delay(300));
  }

  getCourses(): Observable<Course[]> { return of([..._courses]).pipe(delay(200)); }

  getCourse(id: number): Observable<Course> {
    return of(_courses.find(c => c.courseId === id) ?? _courses[0]).pipe(delay(200));
  }

  createCourse(course: Course): Observable<Course> {
    const created = { ...course, courseId: Math.max(0, ..._courses.map(c => c.courseId ?? 0)) + 1, isPublished: false };
    _courses = [..._courses, created];
    return of(created).pipe(delay(500));
  }

  updateCourse(id: number, course: Course): Observable<Course> {
    const updated = { ...course, courseId: id };
    _courses = _courses.map(c => c.courseId === id ? updated : c);
    return of(updated).pipe(delay(400));
  }

  deleteCourse(id: number): Observable<void> {
    _courses = _courses.filter(c => c.courseId !== id);
    return of(undefined).pipe(delay(300));
  }

  uploadImage(_file: File): Observable<{ url: string }> {
    return of({ url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=640' }).pipe(delay(800));
  }

  publishCourse(id: number): Observable<Course> {
    _courses = _courses.map(c => c.courseId === id ? { ...c, isPublished: true } : c);
    return of(_courses.find(c => c.courseId === id)!).pipe(delay(300));
  }

  getCategories(): Observable<Category[]> { return of([...CATEGORIES]).pipe(delay(150)); }
  getCategory(id: number): Observable<Category> { return of(CATEGORIES.find(c => c.id === id) ?? CATEGORIES[0]).pipe(delay(150)); }
  createCategory(cat: Category): Observable<Category> { return of({ ...cat, id: Date.now() }).pipe(delay(400)); }
  updateCategory(id: number, cat: Category): Observable<Category> { return of({ ...cat, id }).pipe(delay(400)); }
  deleteCategory(_id: number): Observable<void> { return of(undefined).pipe(delay(300)); }

  getInstructors(): Observable<Instructor[]> { return of([...INSTRUCTORS]).pipe(delay(150)); }
  getInstructor(id: number | string): Observable<Instructor> { return of(INSTRUCTORS.find(i => i.id === Number(id)) ?? INSTRUCTORS[0]).pipe(delay(150)); }
  createInstructor(inst: Instructor): Observable<Instructor> { return of({ ...inst, id: Date.now() }).pipe(delay(400)); }
  updateInstructor(id: number, inst: Instructor): Observable<Instructor> { return of({ ...inst, id }).pipe(delay(400)); }
  deleteInstructor(_id: number): Observable<void> { return of(undefined).pipe(delay(300)); }

  getModules(_courseId: number, _includeContent?: boolean): Observable<Module[]> { return of([]); }
  getModule(_id: number): Observable<any> { return of({}); }
  createModule(m: any): Observable<any> { return of({ ...m, id: Date.now() }).pipe(delay(400)); }
  updateModule(id: number, m: any): Observable<any> { return of({ ...m, id }).pipe(delay(400)); }
  deleteModule(_id: number): Observable<void> { return of(undefined).pipe(delay(300)); }

  getLessons(_moduleId: number): Observable<any[]> { return of([]); }
  getLesson(_id: number): Observable<any> { return of({}); }
  createLesson(l: any): Observable<any> { return of({ ...l, id: Date.now() }).pipe(delay(400)); }
  updateLesson(id: number, l: any): Observable<any> { return of({ ...l, id }).pipe(delay(400)); }
  deleteLesson(_id: number): Observable<void> { return of(undefined).pipe(delay(300)); }

  getReviews(_courseId: number, _page?: number, _size?: number): Observable<PageResponse<Review>> { return of({ content: [], page: 0, size: 20, totalElements: 0, totalPages: 0, first: true, last: true }); }
  createReview(r: any): Observable<any> { return of({ ...r, id: Date.now() }).pipe(delay(400)); }
  updateReview(id: number, r: any): Observable<any> { return of({ ...r, id }).pipe(delay(400)); }
  deleteReview(_id: number): Observable<void> { return of(undefined).pipe(delay(300)); }

  assignTutor(courseId: number, _tutorEmail: string): Observable<Course> { return this.getCourse(courseId); }
  getCoursesByTutor(_email: string): Observable<Course[]> { return of([..._courses].slice(0, 3)).pipe(delay(200)); }
}
