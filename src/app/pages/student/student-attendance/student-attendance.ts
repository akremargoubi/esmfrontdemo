import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AttendanceRecord {
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  course?: string;
  note?: string;
}

const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { date: '2026-05-01', status: 'PRESENT', course: 'English Grammar' },
  { date: '2026-05-02', status: 'PRESENT', course: 'Oral Expression' },
  { date: '2026-05-05', status: 'LATE',    course: 'English Grammar', note: 'Traffic' },
  { date: '2026-05-06', status: 'PRESENT', course: 'Writing Skills' },
  { date: '2026-05-07', status: 'ABSENT',  course: 'Oral Expression', note: 'Sick leave' },
  { date: '2026-05-08', status: 'PRESENT', course: 'English Grammar' },
  { date: '2026-05-09', status: 'PRESENT', course: 'Writing Skills' },
  { date: '2026-04-28', status: 'PRESENT', course: 'English Grammar' },
  { date: '2026-04-29', status: 'PRESENT', course: 'Oral Expression' },
  { date: '2026-04-25', status: 'LATE',    course: 'Writing Skills' },
  { date: '2026-04-24', status: 'ABSENT',  course: 'English Grammar', note: 'Family emergency' },
  { date: '2026-04-23', status: 'PRESENT', course: 'Oral Expression' },
  { date: '2026-04-22', status: 'PRESENT', course: 'Writing Skills' },
  { date: '2026-04-21', status: 'PRESENT', course: 'English Grammar' },
  { date: '2026-04-18', status: 'PRESENT', course: 'Oral Expression' },
  { date: '2026-04-17', status: 'PRESENT', course: 'Writing Skills' },
  { date: '2026-04-16', status: 'LATE',    course: 'English Grammar' },
  { date: '2026-04-15', status: 'PRESENT', course: 'Oral Expression' },
  { date: '2026-04-14', status: 'ABSENT',  course: 'Writing Skills', note: 'Sick leave' },
  { date: '2026-04-11', status: 'PRESENT', course: 'English Grammar' },
];

@Component({
  selector: 'app-student-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-attendance.html',
  styleUrls: ['./student-attendance.css']
})
export class StudentAttendancePage implements OnInit {
  allRecords: AttendanceRecord[] = [];
  records: AttendanceRecord[] = [];
  loading = false;

  present = 0;
  absent  = 0;
  late    = 0;
  total   = 0;
  attendanceRate = 0;

  filterStatus = 'ALL';
  filterMonth  = 'ALL';
  availableMonths: string[] = [];

  ngOnInit(): void {
    this.loading = true;
    setTimeout(() => {
      this.allRecords = [...MOCK_ATTENDANCE].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      this.computeMonths();
      this.applyFilters();
      this.loading = false;
    }, 600);
  }

  private computeMonths(): void {
    const set = new Set<string>();
    this.allRecords.forEach(r => set.add(r.date.substring(0, 7)));
    this.availableMonths = Array.from(set).sort((a, b) => b.localeCompare(a));
  }

  applyFilters(): void {
    let data = this.allRecords;
    if (this.filterMonth !== 'ALL') {
      data = data.filter(r => r.date.startsWith(this.filterMonth));
    }
    if (this.filterStatus !== 'ALL') {
      data = data.filter(r => r.status === this.filterStatus);
    }
    this.records = data;
    this.recompute(this.filterMonth === 'ALL' ? this.allRecords : this.allRecords.filter(r => r.date.startsWith(this.filterMonth)));
  }

  private recompute(source: AttendanceRecord[]): void {
    this.total   = source.length;
    this.present = source.filter(r => r.status === 'PRESENT').length;
    this.absent  = source.filter(r => r.status === 'ABSENT').length;
    this.late    = source.filter(r => r.status === 'LATE').length;
    this.attendanceRate = this.total > 0
      ? Math.round(((this.present + this.late * 0.5) / this.total) * 100)
      : 0;
  }

  monthLabel(ym: string): string {
    const [year, month] = ym.split('-');
    return new Date(+year, +month - 1, 1).toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  statusColor(s: string): string {
    return { PRESENT: '#15803d', ABSENT: '#dc2626', LATE: '#b45309' }[s] ?? '#64748b';
  }

  statusBg(s: string): string {
    return { PRESENT: '#dcfce7', ABSENT: '#fee2e2', LATE: '#fef3c7' }[s] ?? '#f1f5f9';
  }

  rateColor(): string {
    if (this.attendanceRate >= 80) return '#22c55e';
    if (this.attendanceRate >= 60) return '#f59e0b';
    return '#ef4444';
  }

  circumference = 2 * Math.PI * 40;

  get dashOffset(): number {
    return this.circumference * (1 - this.attendanceRate / 100);
  }
}
