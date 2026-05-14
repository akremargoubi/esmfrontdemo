import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnrollmentService } from '../../services/enrollment.service';
import { MOCK_COURSES, MOCK_STUDENTS } from '../../core/mock/mock-data';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.css']
})
export class EnrollmentComponent implements OnInit {
  private enrollmentService = inject(EnrollmentService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  enrollments: any[] = [];
  loading = true;

  // Filters
  searchTerm = '';
  selectedCourse = '';
  selectedStatus = '';

  // Stats
  totalEnrollments = 0;
  activeCount = 0;
  completedCount = 0;
  avgProgress = 0;

  // Add enrollment modal
  showAddModal = false;
  addForm = { studentId: '', courseId: '', status: 'ACTIVE' };
  addError = '';
  saving = false;

  readonly courses = MOCK_COURSES;
  readonly students = MOCK_STUDENTS;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.enrollmentService.getEnrollments().subscribe({
      next: (data) => {
        this.enrollments = data;
        this.computeStats();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  computeStats(): void {
    this.totalEnrollments = this.enrollments.length;
    this.activeCount      = this.enrollments.filter(e => e.status === 'ACTIVE').length;
    this.completedCount   = this.enrollments.filter(e => e.status === 'COMPLETED').length;
    const progs = this.enrollments.map(e => e.progress ?? e.progressPercent ?? 0);
    this.avgProgress = progs.length
      ? Math.round(progs.reduce((a, b) => a + b, 0) / progs.length)
      : 0;
  }

  get filteredEnrollments(): any[] {
    const q = this.searchTerm.toLowerCase();
    return this.enrollments.filter(e => {
      const matchesSearch = !q
        || (e.studentName && e.studentName.toLowerCase().includes(q))
        || (e.courseName  && e.courseName.toLowerCase().includes(q));
      const matchesCourse = !this.selectedCourse || String(e.courseId) === this.selectedCourse;
      const matchesStatus = !this.selectedStatus || e.status === this.selectedStatus;
      return matchesSearch && matchesCourse && matchesStatus;
    });
  }

  openAddModal(): void {
    this.addForm = { studentId: '', courseId: '', status: 'ACTIVE' };
    this.addError = '';
    this.showAddModal = true;
  }

  saveEnrollment(): void {
    if (!this.addForm.studentId || !this.addForm.courseId) {
      this.addError = 'Please select a student and a course.';
      return;
    }
    const student = this.students.find(s => String(s.id) === this.addForm.studentId);
    const course  = this.courses.find(c => String(c.courseId) === this.addForm.courseId);
    if (!student || !course) { this.addError = 'Invalid student or course.'; return; }

    const alreadyEnrolled = this.enrollments.some(e => e.studentId === student.id && e.courseId === course.courseId);
    if (alreadyEnrolled) { this.addError = `${student.firstName} is already enrolled in this course.`; return; }

    this.saving = true;
    this.enrollmentService.createEnrollment({
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      courseId: course.courseId!,
      courseName: course.name,
      status: this.addForm.status,
    }).subscribe({
      next: () => {
        this.saving = false;
        this.showAddModal = false;
        this.toast.success(`${student.firstName} enrolled in "${course.name}".`);
        this.load();
      },
      error: () => { this.saving = false; this.addError = 'Failed to create enrollment.'; }
    });
  }

  cancelEnrollment(id: number): void {
    this.enrollmentService.cancelEnrollment(id).subscribe(() => {
      const e = this.enrollments.find(x => x.id === id);
      if (e) e.status = 'CANCELLED';
      this.computeStats();
      this.toast.info('Enrollment cancelled.');
      this.cdr.detectChanges();
    });
  }

  deleteEnrollment(id: number): void {
    this.enrollmentService.deleteEnrollment(id).subscribe(() => {
      this.enrollments = this.enrollments.filter(e => e.id !== id);
      this.computeStats();
      this.toast.success('Enrollment removed.');
      this.cdr.detectChanges();
    });
  }

  progressColor(pct: number): string {
    if (pct >= 75) return '#22c55e';
    if (pct >= 40) return '#f59e0b';
    return '#6366f1';
  }

  statusClass(status: string): string {
    return ({ ACTIVE: 'status-active', COMPLETED: 'status-completed', CANCELLED: 'status-cancelled' } as any)[status] ?? '';
  }
}
