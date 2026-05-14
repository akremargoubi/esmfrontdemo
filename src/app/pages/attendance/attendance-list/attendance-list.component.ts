import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AttendanceService, Attendance } from '../../../services/attendance.service';
import { AttendanceAnalyticsComponent } from '../attendance-analytics/attendance-analytics.component';

@Component({
  selector: 'app-attendance-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AttendanceAnalyticsComponent],
  templateUrl: './attendance-list.component.html',
  styleUrl: './attendance-list.component.css'
})
export class AttendanceListComponent implements OnInit {
  attendances: Attendance[] = [];
  filteredAttendances: Attendance[] = [];
  loading = false;
  activeTab: 'list' | 'analytics' = 'list';

  searchTerm = '';
  selectedClass = 'all';
  selectedStatus = 'all';
  selectedDate = '';

  totalPresent = 0;
  totalAbsent = 0;
  totalLate = 0;
  attendanceRate = 0;

  classes: string[] = [];

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void { this.loadAttendances(); }

  loadAttendances(): void {
    this.loading = true;
    this.attendanceService.getAll().subscribe({
      next: (data) => {
        this.attendances = data;
        this.classes = [...new Set(data.map(a => a.className).filter(Boolean) as string[])].sort();
        this.applyFilters();
        this.calculateStats();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  applyFilters(): void {
    this.filteredAttendances = this.attendances.filter(a => {
      const q = this.searchTerm.toLowerCase();
      const matchesSearch = !q
        || (a.studentName && a.studentName.toLowerCase().includes(q))
        || (a.className   && a.className.toLowerCase().includes(q));
      const matchesClass  = this.selectedClass  === 'all' || a.className === this.selectedClass;
      const matchesStatus = this.selectedStatus === 'all' || a.status    === this.selectedStatus;
      const matchesDate   = !this.selectedDate  || (a.date && a.date.startsWith(this.selectedDate));
      return matchesSearch && matchesClass && matchesStatus && matchesDate;
    });
  }

  calculateStats(): void {
    this.totalPresent = this.attendances.filter(a => a.status === 'PRESENT').length;
    this.totalAbsent  = this.attendances.filter(a => a.status === 'ABSENT').length;
    this.totalLate    = this.attendances.filter(a => a.status === 'LATE').length;
    const total = this.attendances.length;
    this.attendanceRate = total > 0
      ? Math.round(((this.totalPresent + this.totalLate) / total) * 100)
      : 0;
  }

  deleteAttendance(id: number): void {
    if (!confirm('Delete this attendance record?')) return;
    this.attendanceService.delete(id).subscribe({
      next: () => this.loadAttendances()
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedClass = 'all';
    this.selectedStatus = 'all';
    this.selectedDate = '';
    this.filteredAttendances = [...this.attendances];
  }
}
