import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import {
  MOCK_CLASSES, MOCK_STUDENTS, MOCK_ASSESSMENTS, MOCK_GRADES,
  MOCK_ATTENDANCE, MOCK_SCHEDULE, MOCK_PLANNING, MOCK_ML, MOCK_ACTIVITY
} from '../../core/mock/mock-data';

const TUTOR_ID   = '2';
const TUTOR_NAME = 'Sonia Ben Ali';

@Component({
  selector: 'app-tutor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './tutor-dashboard.html',
  styleUrls: ['./tutor-dashboard.css']
})
export class TutorDashboard implements OnInit {
  private auth = inject(AuthService);

  loading = true;
  tutorName = '';

  myClasses:       any[] = [];
  myStudents:      any[] = [];
  todaySchedule:   any[] = [];
  pendingGrading:  any[] = [];
  recentGrades:    any[] = [];
  atRiskStudents:  any[] = [];
  upcomingEvents:  any[] = [];
  activityFeed:    any[] = [];
  trendStudents:   any[] = [];
  aiRecommendations: any[] = [];

  totalStudents  = 0;
  attendanceRate = 0;
  avgGrade       = 0;
  publishedCount = 0;
  draftCount     = 0;
  closedCount    = 0;

  readonly DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  ngOnInit(): void {
    setTimeout(() => {
      this.tutorName = this.auth.getFullName();

      this.myClasses = MOCK_CLASSES.filter(c => c.tutorId === TUTOR_ID);
      const classNames = this.myClasses.map(c => c.name);

      this.myStudents    = MOCK_STUDENTS.filter(s => classNames.includes(s.className));
      this.totalStudents = this.myStudents.length;

      const todayName = this.DAYS[new Date().getDay()];
      this.todaySchedule = MOCK_SCHEDULE.filter(s => s.tutorName === TUTOR_NAME && s.dayOfWeek === todayName);

      const myAssessments = MOCK_ASSESSMENTS.filter(a => classNames.includes(a.className ?? ''));
      this.pendingGrading  = myAssessments.filter(a => a.status === 'DRAFT');
      this.publishedCount  = myAssessments.filter(a => a.status === 'PUBLISHED').length;
      this.draftCount      = myAssessments.filter(a => a.status === 'DRAFT').length;
      this.closedCount     = myAssessments.filter(a => a.status === 'CLOSED').length;

      const myGrades = MOCK_GRADES.filter(g => classNames.includes(g.className ?? ''));
      this.recentGrades = myGrades.slice(-5).reverse();
      this.avgGrade     = myGrades.length
        ? Math.round(myGrades.reduce((s, g) => s + g.score, 0) / myGrades.length) : 0;

      const myAtt = MOCK_ATTENDANCE.filter(a => classNames.includes(a.className ?? ''));
      const present = myAtt.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
      this.attendanceRate = myAtt.length ? Math.round((present / myAtt.length) * 100) : 0;

      this.atRiskStudents = (MOCK_ML as any).dso1Students
        .filter((s: any) => classNames.includes(s.className ?? ''))
        .slice(0, 4);

      this.upcomingEvents = MOCK_PLANNING.filter(p => {
        const cls = p.className.split(',').map((x: string) => x.trim());
        return new Date(p.startDate) >= new Date()
          && (cls.includes('ALL') || cls.some((c: string) => classNames.includes(c)));
      }).slice(0, 4);

      this.activityFeed = MOCK_ACTIVITY.slice(0, 5);

      this.trendStudents = (MOCK_ML as any).dso2Students
        .filter((s: any) => classNames.includes(s.className ?? ''))
        .slice(0, 4);

      this.aiRecommendations = this.generateAIRecommendations(classNames);

      this.loading = false;
    }, 600);
  }

  private generateAIRecommendations(classNames: string[]): any[] {
    const recs: any[] = [];
    if (classNames.includes('TWIN1')) {
      recs.push({ icon: 'lightbulb', title: 'Conversational focus', desc: 'TWIN1 students show 23% higher engagement with interactive speaking exercises.', type: 'lesson' });
    }
    if (classNames.includes('TWIN2')) {
      recs.push({ icon: 'trending_up', title: 'Business writing drill', desc: '2 TWIN2 students scored below 70% on written tasks. Recommend targeted grammar exercises.', type: 'grade' });
    }
    recs.push({ icon: 'group_work', title: 'Peer review session', desc: 'AI suggests pairing strong & struggling students for collaborative review this week.', type: 'engagement' });
    recs.push({ icon: 'assignment_turned_in', title: 'Auto-grade available', desc: '3 assessments can be auto-graded to save ~45 minutes of manual work.', type: 'workflow' });
    return recs;
  }

  classStudents(name: string): any[] {
    return this.myStudents.filter(s => s.className === name);
  }

  classAvgGrade(name: string): number {
    const grades = MOCK_GRADES.filter(g => g.className === name);
    return grades.length ? Math.round(grades.reduce((s, g) => s + g.score, 0) / grades.length) : 0;
  }

  trendIcon(trend: string): string {
    return ({ IMPROVING: 'trending_up', STABLE: 'trending_flat', DECLINING: 'trending_down' } as any)[trend] ?? 'trending_flat';
  }
  trendColor(trend: string): string {
    return ({ IMPROVING: '#16a34a', STABLE: '#6366f1', DECLINING: '#dc2626' } as any)[trend] ?? '#94a3b8';
  }

  gradeColor(score: number): string {
    if (score >= 85) return '#16a34a';
    if (score >= 70) return '#d97706';
    return '#dc2626';
  }

  riskColor(level: string): string {
    return ({ CRITICAL: '#dc2626', HIGH: '#ea580c', MODERATE: '#d97706', LOW: '#16a34a' } as any)[level] ?? '#94a3b8';
  }

  riskBg(level: string): string {
    return ({ CRITICAL: '#fee2e2', HIGH: '#ffedd5', MODERATE: '#fef3c7', LOW: '#dcfce7' } as any)[level] ?? '#f1f5f9';
  }

  eventIcon(type: string): string {
    return ({ EXAM: 'assignment', EVENT: 'event', HOLIDAY: 'beach_access', WORKSHOP: 'school' } as any)[type] ?? 'event';
  }

  eventColor(type: string): string {
    return ({ EXAM: '#7c3aed', EVENT: '#0369a1', HOLIDAY: '#15803d', WORKSHOP: '#b45309' } as any)[type] ?? '#64748b';
  }

  statusClass(s: string): string {
    return ({ PUBLISHED: 'badge-published', DRAFT: 'badge-draft', CLOSED: 'badge-closed' } as any)[s] ?? 'badge-default';
  }

  gradeLetterClass(g: string): string {
    if (!g) return 'badge-default';
    if (g.startsWith('A')) return 'badge-published';
    if (g.startsWith('B')) return 'badge-class';
    if (g.startsWith('C')) return 'badge-draft';
    return 'badge-closed';
  }

  activityColor(type: string): string {
    return ({ assessment: '#7c3aed', enrollment: '#0369a1', payment: '#16a34a', attendance: '#d97706', resource: '#b45309', grade: '#6366f1', alert: '#dc2626', class: '#0891b2' } as any)[type] ?? '#64748b';
  }

  private readonly CARD_GRADIENTS = [
    'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
    'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
  ];
  cardGradient(i: number): string { return this.CARD_GRADIENTS[i % this.CARD_GRADIENTS.length]; }
}
