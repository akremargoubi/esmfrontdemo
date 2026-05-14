import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AssessmentService } from '../../services/assessment.service';
import { CourseService } from '../../services/course.service';
import { PaymentService } from '../../services/payment';
import { ToastService } from '../../services/toast.service';
import { MOCK_CLASSES, MOCK_ACTIVITY, MOCK_PAYMENTS, MOCK_ENROLLMENTS, MOCK_PLANNING, MOCK_ATTENDANCE, MOCK_GRADES } from '../../core/mock/mock-data';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface StudentClass {
  id: number; name: string; level: string; specialty: string; studentCount: number;
}

interface RevenueMonth { month: string; amount: number; isCurrent: boolean; }
interface BarItem { name: string; count: number; pct: number; }
interface ClassAttendance { name: string; rate: number; }

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private assessmentService = inject(AssessmentService);
  private courseService = inject(CourseService);
  private paymentService = inject(PaymentService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  totalStudents = 0;
  totalCourses = 0;
  totalAssessments = 0;
  totalClasses = 0;
  totalResources = 8;
  attendanceRate = 87;
  totalEnrollments = MOCK_ENROLLMENTS.length;
  averageGrade = 0;

  // Revenue analytics
  paidRevenue = 0;
  pendingRevenue = 0;
  overdueRevenue = 0;
  revenueMonths: RevenueMonth[] = [];
  revenueMax = 1;

  // Analytics bar data
  topCourses: BarItem[] = [];
  classAttendance: ClassAttendance[] = [];

  // Announcements
  announcements: any[] = [];

  recentActivity = [...MOCK_ACTIVITY];
  upcomingAlerts: any[] = [];
  classes: StudentClass[] = [...MOCK_CLASSES];

  showClassForm = false;
  newClass = { name: '', level: '', specialty: '', description: '' };
  classError = '';
  loading = true;

  readonly kpiCards = [
    { label: 'Total Students',   icon: 'school',        color: '#6366f1', bg: '#ede9fe', key: 'students'    },
    { label: 'Active Classes',   icon: 'class',         color: '#0ea5e9', bg: '#e0f2fe', key: 'classes'     },
    { label: 'Courses',          icon: 'menu_book',     color: '#10b981', bg: '#d1fae5', key: 'courses'     },
    { label: 'Assessments',      icon: 'assignment',    color: '#f59e0b', bg: '#fef3c7', key: 'assessments' },
    { label: 'Attendance Rate',  icon: 'fact_check',    color: '#ec4899', bg: '#fce7f3', key: 'attendance'  },
    { label: 'Revenue (Paid)',   icon: 'payments',      color: '#10b981', bg: '#d1fae5', key: 'revenue'     },
    { label: 'Enrollments',      icon: 'how_to_reg',    color: '#8b5cf6', bg: '#f3e8ff', key: 'enrollments' },
    { label: 'Avg Grade',        icon: 'grade',         color: '#f59e0b', bg: '#fef9c3', key: 'avggrade'    },
  ];

  getKpiValue(key: string): string {
    switch (key) {
      case 'students':    return String(this.totalStudents);
      case 'classes':     return String(this.totalClasses);
      case 'courses':     return String(this.totalCourses);
      case 'assessments': return String(this.totalAssessments);
      case 'attendance':  return `${this.attendanceRate}%`;
      case 'revenue':     return `${this.paidRevenue} TND`;
      case 'enrollments': return String(this.totalEnrollments);
      case 'avggrade':    return `${this.averageGrade}%`;
      default: return '—';
    }
  }

  getKpiTrend(key: string): string {
    const trends: Record<string, string> = {
      students:    '+3 this month',
      classes:     'Across 4 levels',
      courses:     '2 new this month',
      assessments: '3 upcoming',
      attendance:  '+2% vs last month',
      revenue:     `${this.pendingRevenue} TND pending`,
      enrollments: '2 new this week',
      avggrade:    'Class average',
    };
    return trends[key] ?? '';
  }

  ngOnInit(): void {
    this.totalClasses = this.classes.length;
    this.totalStudents = this.classes.reduce((sum, c) => sum + (c.studentCount ?? 0), 0);

    // Revenue stats from mock payments
    this.paidRevenue    = MOCK_PAYMENTS.filter(p => p.status === 'PAID').map(p => p.amount).reduce((a, b) => a + b, 0);
    this.pendingRevenue = MOCK_PAYMENTS.filter(p => p.status === 'PENDING').map(p => p.amount).reduce((a, b) => a + b, 0);
    this.overdueRevenue = MOCK_PAYMENTS.filter(p => p.status === 'OVERDUE').map(p => p.amount).reduce((a, b) => a + b, 0);

    // Revenue sparkline — synthetic monthly data finishing with current month paid
    this.revenueMonths = [
      { month: 'Sep', amount: 980,  isCurrent: false },
      { month: 'Oct', amount: 1200, isCurrent: false },
      { month: 'Nov', amount: 1580, isCurrent: false },
      { month: 'Dec', amount: 1320, isCurrent: false },
      { month: 'Jan', amount: this.paidRevenue, isCurrent: true },
    ];
    this.revenueMax = Math.max(...this.revenueMonths.map(m => m.amount), 1);

    // Top courses by enrollment count from MOCK_ENROLLMENTS
    const courseCount: Record<string, number> = {};
    MOCK_ENROLLMENTS.forEach(e => { courseCount[e.courseName] = (courseCount[e.courseName] ?? 0) + 1; });
    const sortedCourses = Object.entries(courseCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxCourse = Math.max(...sortedCourses.map(c => c[1]), 1);
    this.topCourses = sortedCourses.map(([name, count]) => ({
      name: name.length > 22 ? name.slice(0, 20) + '…' : name,
      count,
      pct: Math.round((count / maxCourse) * 100),
    }));

    // Attendance rate per class
    const classPresent: Record<string, number> = {};
    const classTotal: Record<string, number> = {};
    MOCK_ATTENDANCE.forEach(a => {
      const cl = a.className || 'Unknown';
      classTotal[cl] = (classTotal[cl] ?? 0) + 1;
      if (a.status === 'PRESENT' || a.status === 'LATE') classPresent[cl] = (classPresent[cl] ?? 0) + 1;
    });
    this.classAttendance = Object.keys(classTotal).map(name => ({
      name,
      rate: Math.round(((classPresent[name] ?? 0) / classTotal[name]) * 100),
    }));

    // Average grade
    if (MOCK_GRADES.length > 0) {
      const avg = MOCK_GRADES.map(g => (g.score / g.maxScore) * 100).reduce((a, b) => a + b, 0) / MOCK_GRADES.length;
      this.averageGrade = Math.round(avg * 10) / 10;
    }

    // Announcements from planning (upcoming events)
    const nowMs = Date.now();
    this.announcements = MOCK_PLANNING
      .filter(p => new Date(p.startDate).getTime() >= nowMs)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 4);

    forkJoin({
      courses: this.courseService.getAll().pipe(catchError(() => of([]))),
      assessments: this.assessmentService.getAll().pipe(catchError(() => of([]))),
    }).subscribe(({ courses, assessments }) => {
      this.totalCourses = courses.length;
      this.totalAssessments = assessments.length;

      const now = Date.now();
      this.upcomingAlerts = assessments
        .filter((a: any) => a.startDate && a.status === 'PUBLISHED')
        .map((a: any) => {
          const hoursLeft = (new Date(a.startDate).getTime() - now) / 3600000;
          return { ...a, hoursLeft: Math.floor(hoursLeft), urgency: hoursLeft <= 6 ? 'urgent' : 'soon' };
        })
        .filter((a: any) => a.hoursLeft >= 0 && a.hoursLeft <= 48)
        .sort((x: any, y: any) => x.hoursLeft - y.hoursLeft);

      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  dismissAlert(index: number): void {
    this.upcomingAlerts.splice(index, 1);
  }

  createClass(): void {
    if (!this.newClass.name.trim()) { this.classError = 'Class name is required.'; return; }
    const created: StudentClass = {
      id: Math.max(...this.classes.map(c => c.id)) + 1,
      name: this.newClass.name,
      level: this.newClass.level,
      specialty: this.newClass.specialty,
      studentCount: 0,
    };
    this.classes = [...this.classes, created];
    this.totalClasses = this.classes.length;
    this.showClassForm = false;
    this.newClass = { name: '', level: '', specialty: '', description: '' };
    this.classError = '';
    this.toast.success(`Class "${created.name}" created successfully.`);
    this.cdr.detectChanges();
  }

  deleteClass(id: number): void {
    const cls = this.classes.find(c => c.id === id);
    this.classes = this.classes.filter(c => c.id !== id);
    this.totalClasses = this.classes.length;
    this.totalStudents = this.classes.reduce((sum, c) => sum + (c.studentCount ?? 0), 0);
    if (cls) this.toast.info(`Class "${cls.name}" removed.`);
    this.cdr.detectChanges();
  }

  eventTypeIcon(type: string): string {
    return ({ EXAM: '📝', EVENT: '📅', HOLIDAY: '🏖️', WORKSHOP: '🔧' } as any)[type] ?? '📌';
  }

  eventTypeColor(type: string): string {
    return ({ EXAM: '#ef4444', EVENT: '#6366f1', HOLIDAY: '#10b981', WORKSHOP: '#f59e0b' } as any)[type] ?? '#64748b';
  }

  formatShortDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  formatRelative(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }
}
