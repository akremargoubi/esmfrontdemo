import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import {
  MOCK_PARENT_CHILDREN, MOCK_ASSESSMENTS, MOCK_SCHEDULE,
  MOCK_ATTENDANCE, MOCK_PLANNING, MOCK_STUDENTS
} from '../../../core/mock/mock-data';

@Component({
  selector: 'app-parent-planning',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './parent-planning.html',
  styleUrls: ['./parent-planning.css']
})
export class ParentPlanningPage implements OnInit {
  private auth = inject(AuthService);

  children:    any[] = [];
  selected:    any   = null;

  assessments: any[] = [];
  schedule:    any[] = [];
  attendance:  any[] = [];
  events:      any[] = [];

  readonly DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  readonly DAY_COLORS: Record<string, string> = {
    Monday: '#6366f1', Tuesday: '#0ea5e9', Wednesday: '#10b981',
    Thursday: '#f59e0b', Friday: '#ef4444', Saturday: '#ec4899', Sunday: '#8b5cf6'
  };

  ngOnInit(): void {
    const userId  = this.auth.getUserId() ?? '4';
    this.children = MOCK_PARENT_CHILDREN[userId] ?? MOCK_PARENT_CHILDREN['4'] ?? [];
    if (this.children.length) this.selectChild(this.children[0]);
  }

  selectChild(child: any): void {
    this.selected = child;
    const cn = child.className;
    const sid = child.id;
    const now = Date.now();

    this.assessments = MOCK_ASSESSMENTS
      .filter(a => a.className === cn && a.status === 'PUBLISHED' && new Date(a.startDate).getTime() > now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    this.schedule = MOCK_SCHEDULE.filter(s => s.className === cn);

    this.attendance = MOCK_ATTENDANCE
      .filter(a => a.studentId === sid)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    this.events = MOCK_PLANNING.filter(p => {
      const classes = p.className.split(',').map((x: string) => x.trim());
      return classes.includes('ALL') || classes.includes(cn);
    }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }

  forDay(day: string): any[] { return this.schedule.filter(s => s.dayOfWeek === day); }
  dayColor(day: string): string { return this.DAY_COLORS[day] ?? '#6366f1'; }

  getCountdown(dateStr: string): string {
    const diff = new Date(dateStr).getTime() - Date.now();
    if (diff < 0) return 'Passed';
    const days = Math.floor(diff / 86400000);
    const hrs  = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return `In ${days}d`;
    return `In ${hrs}h`;
  }

  eventIcon(type: string): string {
    return ({ EXAM: 'assignment', EVENT: 'event', HOLIDAY: 'beach_access', WORKSHOP: 'school' } as any)[type] ?? 'event';
  }
  eventColor(type: string): string {
    return ({ EXAM: '#7c3aed', EVENT: '#0369a1', HOLIDAY: '#15803d', WORKSHOP: '#b45309' } as any)[type] ?? '#6366f1';
  }

  attColor(s: string): string {
    return ({ PRESENT: '#16a34a', ABSENT: '#dc2626', LATE: '#d97706' } as any)[s] ?? '#94a3b8';
  }
  attBg(s: string): string {
    return ({ PRESENT: '#dcfce7', ABSENT: '#fee2e2', LATE: '#fef9c3' } as any)[s] ?? '#f1f5f9';
  }

  get presentCount(): number { return this.attendance.filter(a => a.status === 'PRESENT').length; }
  get attRate(): number {
    if (!this.attendance.length) return 100;
    const ok = this.attendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    return Math.round((ok / this.attendance.length) * 100);
  }
}
