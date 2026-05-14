import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MOCK_ENROLLMENTS, MOCK_STUDENTS, MOCK_CREDENTIALS } from '../../../core/mock/mock-data';
import { COURSES } from '../../../data/courses.data';

@Component({
  selector: 'app-student-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-courses.html'
})
export class StudentCoursesPage implements OnInit {
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  enrolledCourses: any[] = [];
  availableCourses: any[] = [];
  loading = true;
  filterLevel = 'ALL';
  levels = ['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  activeTab: 'enrolled' | 'browse' = 'enrolled';

  studentName = '';
  studentId = 0;

  enrollingCourseId: number | null = null;
  enrollSuccess = '';
  enrollError = '';

  ngOnInit(): void {
    const email = this.auth.getEmail() ?? 'student@fluencity.com';
    const profile = MOCK_STUDENTS.find(s => s.email === email) ?? MOCK_STUDENTS[0];
    this.studentId = profile.id;
    this.studentName = `${profile.firstName} ${profile.lastName}`;
    this.loadData();
  }

  private getLevel(course: any): string {
    const map: Record<string, string> = { 'Beginner': 'A2', 'Intermediate': 'B1', 'Advanced': 'C1' };
    return map[course.level] ?? 'B1';
  }

  loadData(): void {
    this.loading = true;
    const enrolledIds: number[] = [];
    this.enrolledCourses = MOCK_ENROLLMENTS
      .filter(e => e.studentId === this.studentId)
      .map(e => {
        const course = COURSES.find(c => c.id === e.courseId);
        enrolledIds.push(e.courseId);
        return { ...e, course, progressPercent: e.progress, level: course ? this.getLevel(course) : 'B1' };
      });
    this.availableCourses = COURSES
      .filter(c => !enrolledIds.includes(c.id))
      .map(c => ({ courseId: c.id, imageUrl: c.image, price: c.price === 'Free' ? 0 : parseInt((c.price ?? '$0').replace(/[^0-9]/g, '')) || 0, ...c, level: this.getLevel(c) }));
    this.loading = false;
    this.cdr.detectChanges();
  }

  enroll(course: any): void {
    this.enrollingCourseId = course.courseId;
    this.enrollError = '';
    this.enrollSuccess = '';
    this.cdr.detectChanges();

    MOCK_ENROLLMENTS.push({
      id: MOCK_ENROLLMENTS.length + 1,
      studentId: this.studentId,
      studentName: this.studentName,
      courseId: course.courseId,
      courseName: course.title || course.name,
      status: 'ACTIVE',
      enrolledAt: new Date().toISOString(),
      progress: 0,
    });

    setTimeout(() => {
      this.enrollSuccess = `Successfully enrolled in "${course.title || course.name}"!`;
      this.enrollingCourseId = null;
      this.loadData();
      setTimeout(() => { this.enrollSuccess = ''; this.cdr.detectChanges(); }, 4000);
    }, 500);
  }

  get filteredAvailable(): any[] {
    const list = this.filterLevel === 'ALL' ? this.availableCourses : this.availableCourses.filter(c => c.level === this.filterLevel);
    return list;
  }

  levelBg(level: string): string {
    const map: Record<string, string> = { A1: '#dcfce7', A2: '#bbf7d0', B1: '#dbeafe', B2: '#bfdbfe', C1: '#ede9fe', C2: '#ddd6fe' };
    return map[level] ?? '#f1f5f9';
  }

  levelColor(level: string): string {
    const map: Record<string, string> = { A1: '#15803d', A2: '#166534', B1: '#1d4ed8', B2: '#1e40af', C1: '#6d28d9', C2: '#5b21b6' };
    return map[level] ?? '#374151';
  }

  progressColor(pct: number): string {
    if (pct >= 100) return '#22c55e';
    if (pct >= 50) return '#6366f1';
    return '#f59e0b';
  }
}
