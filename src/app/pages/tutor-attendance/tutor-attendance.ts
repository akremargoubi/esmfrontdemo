import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { inject } from '@angular/core';
import { MOCK_CLASSES, MOCK_STUDENTS, MOCK_ATTENDANCE, MOCK_SCHEDULE } from '../../core/mock/mock-data';
import { ToastService } from '../../services/toast.service';

const TUTOR_ID   = '2';
const TUTOR_NAME = 'Sonia Ben Ali';
type Status = 'PRESENT' | 'ABSENT' | 'LATE';

@Component({
  selector: 'app-tutor-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './tutor-attendance.html',
  styleUrls: ['./tutor-attendance.css']
})
export class TutorAttendance implements OnInit {
  private toast = inject(ToastService);

  myClasses:     any[] = [];
  selectedClass  = '';
  selectedDate   = new Date().toISOString().split('T')[0];
  todayCourse    = '';

  students: any[]  = [];
  records:  Record<number, Status> = {};

  saving = false;
  saved  = false;

  viewMode: 'daily' | 'weekly' = 'daily';
  weekSummary: { date: string; present: number; late: number; absent: number; total: number }[] = [];

  readonly DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  ngOnInit(): void {
    this.myClasses = MOCK_CLASSES.filter(c => c.tutorId === TUTOR_ID);
    if (this.myClasses.length) {
      this.selectedClass = this.myClasses[0].name;
      this.loadStudents();
      this.buildWeekSummary();
    }
  }

  loadStudents(): void {
    this.saved   = false;
    this.students = MOCK_STUDENTS.filter(s => s.className === this.selectedClass);
    this.records  = {};

    for (const s of this.students) {
      const existing = MOCK_ATTENDANCE.find(
        a => a.studentId === s.id && a.date?.startsWith(this.selectedDate)
      );
      this.records[s.id] = (existing?.status as Status) ?? 'PRESENT';
    }

    const todayDay = this.DAYS[new Date(this.selectedDate).getDay()];
    const sched = MOCK_SCHEDULE.find(
      s => s.className === this.selectedClass && s.tutorName === TUTOR_NAME && s.dayOfWeek === todayDay
    );
    this.todayCourse = sched ? `${sched.courseName} (${sched.startTime}–${sched.endTime}, ${sched.room})` : '';
  }

  buildWeekSummary(): void {
    this.weekSummary = [];
    const today = new Date();
    const classNames = this.myClasses.map(c => c.name);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const dayRecords = MOCK_ATTENDANCE.filter(
        a => a.date?.startsWith(dateStr) && classNames.includes(a.className ?? '')
      );

      this.weekSummary.push({
        date: dateStr,
        present: dayRecords.filter(a => a.status === 'PRESENT').length,
        late: dayRecords.filter(a => a.status === 'LATE').length,
        absent: dayRecords.filter(a => a.status === 'ABSENT').length,
        total: dayRecords.length,
      });
    }
  }

  markAll(status: Status): void {
    for (const s of this.students) { this.records[s.id] = status; }
  }

  setStatus(studentId: number, status: Status): void { this.records[studentId] = status; }

  save(): void {
    this.saving = true;
    setTimeout(() => {
      this.saving = false;
      this.saved  = true;
      this.toast.success(`Attendance saved for ${this.selectedClass} — ${this.selectedDate}`);
    }, 700);
  }

  get presentCount(): number { return this.students.filter(s => this.records[s.id] === 'PRESENT').length; }
  get lateCount():    number { return this.students.filter(s => this.records[s.id] === 'LATE').length; }
  get absentCount():  number { return this.students.filter(s => this.records[s.id] === 'ABSENT').length; }

  prevAttendance(studentId: number): any[] {
    return MOCK_ATTENDANCE
      .filter(a => a.studentId === studentId)
      .slice(-3)
      .reverse();
  }

  statusIcon(s: Status): string {
    return ({ PRESENT: 'check_circle', ABSENT: 'cancel', LATE: 'schedule' } as any)[s] ?? 'help';
  }
  statusColor(s: Status): string {
    return ({ PRESENT: '#16a34a', ABSENT: '#dc2626', LATE: '#d97706' } as any)[s] ?? '#94a3b8';
  }

  formatDay(dateStr: string): string {
    const d = new Date(dateStr);
    return this.DAYS[d.getDay()].slice(0, 3);
  }
  isToday(dateStr: string): boolean {
    return dateStr === new Date().toISOString().split('T')[0];
  }
}
