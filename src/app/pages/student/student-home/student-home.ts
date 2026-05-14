import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { GradeService, Grade, LeaderboardEntry } from '../../../services/grade.service';
import { AssessmentService, Assessment } from '../../../services/assessment.service';
import { CertificateService } from '../../../services/certificate.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { ClassService, ClassResponse } from '../../../core/services/class.service';
import { MOCK_STUDENTS, MOCK_ENROLLMENTS } from '../../../core/mock/mock-data';
import { COURSES } from '../../../data/courses.data';
import { MOCK_LESSONS } from '../../../core/mock/mock-lessons';
import { catchError, of } from 'rxjs';

type ActivePanel = null | 'leaderboard' | 'grades' | 'assessments' | 'certificates' | 'class';

interface UpcomingAlert {
  title: string; courseName: string; type: string;
  startDate: string; hoursLeft: number; urgency: 'soon' | 'urgent';
}

interface Badge {
  id: string; icon: string; name: string; desc: string; earned: boolean; xp: number;
}

interface AiSuggestion {
  icon: string; title: string; body: string; action: string; route: string;
}

@Component({
  selector: 'app-student-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  templateUrl: './student-home.html',
  styleUrls: ['./student-home.css']
})
export class StudentHome implements OnInit {
  private auth = inject(AuthService);
  private gradeService = inject(GradeService);
  private assessmentService = inject(AssessmentService);
  private certificateService = inject(CertificateService);
  private classService = inject(ClassService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  activePanel: ActivePanel = null;
  studentName = '';
  studentEmail = '';
  studentClass = '';
  classDetails: ClassResponse | null = null;
  loadingClass = false;

  upcomingAlerts: UpcomingAlert[] = [];
  leaderboard: LeaderboardEntry[] = [];
  myRank: number | null = null;
  loadingLb = false;

  grades: Grade[] = [];
  averagePct = 0;
  loadingGrades = false;

  assessments: Assessment[] = [];
  filterType = '';
  loadingAssessments = false;
  generatingCertificate = false;

  // Gamification
  xp = 0;
  level = 1;
  xpToNext = 500;
  xpProgress = 0;
  streak = 0;
  attendanceRate = 0;

  showAiPanel = false;
  aiTyping = false;
  aiMessages: { role: 'user' | 'ai'; text: string }[] = [];
  aiInput = '';

  badges: Badge[] = [
    { id: 'first_grade', icon: '⭐', name: 'First Grade', desc: 'Received your first grade', earned: false, xp: 50 },
    { id: 'top_scorer', icon: '🏆', name: 'Top Scorer', desc: 'Achieved 90%+ on an assessment', earned: false, xp: 200 },
    { id: 'consistent', icon: '🔥', name: 'On Fire', desc: '5-day learning streak', earned: false, xp: 100 },
    { id: 'perfect', icon: '💯', name: 'Perfectionist', desc: 'Score 100% on any quiz', earned: false, xp: 300 },
    { id: 'enrolled', icon: '📚', name: 'Scholar', desc: 'Enrolled in a course', earned: false, xp: 50 },
    { id: 'certified', icon: '🎓', name: 'Certified', desc: 'Earned your first certificate', earned: false, xp: 500 },
  ];

  aiSuggestions: AiSuggestion[] = [
    { icon: '📖', title: 'Review Grammar Basics', body: 'Your recent scores suggest reviewing Chapter 3 grammar rules could boost your average by ~8%.', action: 'Go to Courses', route: '/student/courses' },
    { icon: '⚡', title: 'Practice Quiz Ready', body: 'A new vocabulary quiz is available. Quick 10-minute practice can improve retention by 35%.', action: 'Take Quiz', route: '/student/assessments' },
    { icon: '📅', title: 'Upcoming Exam Prep', body: 'You have an exam in 3 days. Students who review 2 days before score 22% higher on average.', action: 'View Schedule', route: '/student/schedule' },
  ];

  motivationalQuotes = [
    "Every expert was once a beginner. Keep going! 💪",
    "Small daily progress adds up to big results. 🌱",
    "Learning is not a race, it's a journey. 🚀",
    "Your future self is cheering you on today! 🎉",
    "Consistency beats perfection every time. ✨",
  ];
  quote = '';

  ngOnInit(): void {
    this.studentEmail = this.auth.getEmail() ?? 'student@fluencity.com';
    this.studentName  = this.auth.getFullName();

    const profile = MOCK_STUDENTS.find(s => s.email === this.studentEmail) ?? MOCK_STUDENTS[0];
    this.studentClass = profile.className ?? '';

    this.quote = this.motivationalQuotes[Math.floor(Math.random() * this.motivationalQuotes.length)];
    this.streak = 3 + Math.floor(Math.random() * 12);
    this.attendanceRate = 75 + Math.floor(Math.random() * 24);

    this.fetchLeaderboard();
    this.fetchGrades();
    this.fetchAssessments();
    this.fetchClassDetails();
  }

  openPanel(panel: ActivePanel): void {
    this.activePanel = this.activePanel === panel ? null : panel;
    this.cdr.detectChanges();
  }
  closePanel(): void { this.activePanel = null; }
  dismissAlert(index: number): void { this.upcomingAlerts.splice(index, 1); }

  fetchLeaderboard(): void {
    this.loadingLb = true;
    this.gradeService.getGlobalLeaderboard().pipe(catchError(() => of([]))).subscribe(data => {
      this.leaderboard = data;
      const me = data.find(e => e.studentName === this.studentName);
      this.myRank = me?.rank ?? null;
      this.loadingLb = false;
      this.cdr.detectChanges();
    });
  }

  fetchGrades(): void {
    this.loadingGrades = true;
    this.gradeService.getByStudent(this.studentEmail).pipe(catchError(() => of([]))).subscribe(data => {
      this.grades = data;
      if (data.length > 0) {
        const avg = data.map(g => (g.score / g.maxScore) * 100).reduce((a, b) => a + b, 0) / data.length;
        this.averagePct = Math.round(avg * 10) / 10;
        this.computeXP(data);
        this.updateBadges(data);
      }
      this.loadingGrades = false;
      this.cdr.detectChanges();
    });
  }

  private computeXP(grades: Grade[]): void {
    let totalXp = this.streak * 15;
    grades.forEach(g => {
      const pct = (g.score / g.maxScore) * 100;
      totalXp += Math.round(pct * 1.5);
    });
    this.xp = totalXp;
    this.level = Math.floor(totalXp / 500) + 1;
    this.xpToNext = this.level * 500;
    const xpInLevel = totalXp % 500;
    this.xpProgress = Math.min(100, Math.round((xpInLevel / 500) * 100));
  }

  private updateBadges(grades: Grade[]): void {
    if (grades.length > 0) this.badges.find(b => b.id === 'first_grade')!.earned = true;
    if (grades.some(g => (g.score / g.maxScore) >= 0.9)) this.badges.find(b => b.id === 'top_scorer')!.earned = true;
    if (grades.some(g => g.score === g.maxScore)) this.badges.find(b => b.id === 'perfect')!.earned = true;
    if (this.streak >= 5) this.badges.find(b => b.id === 'consistent')!.earned = true;
    if (this.passingGrades.length > 0) this.badges.find(b => b.id === 'certified')!.earned = true;
    this.badges.find(b => b.id === 'enrolled')!.earned = true;
  }

  fetchAssessments(): void {
    this.loadingAssessments = true;
    const req$ = this.studentClass
      ? this.assessmentService.getByClassName(this.studentClass)
      : this.assessmentService.getAll();

    req$.pipe(catchError(() => of([]))).subscribe(data => {
      this.assessments = data.filter(a => a.status === 'PUBLISHED');
      const now = Date.now();
      this.upcomingAlerts = this.assessments
        .filter(a => a.startDate)
        .map(a => ({ a, hoursLeft: (new Date(a.startDate!).getTime() - now) / 3600000 }))
        .filter(({ hoursLeft }) => hoursLeft >= 0 && hoursLeft <= 48)
        .sort((x, y) => x.hoursLeft - y.hoursLeft)
        .map(({ a, hoursLeft }) => ({
          title: a.title, courseName: a.courseName, type: a.type,
          startDate: a.startDate!, hoursLeft: Math.floor(hoursLeft),
          urgency: (hoursLeft <= 6 ? 'urgent' : 'soon') as 'urgent' | 'soon'
        }));
      this.loadingAssessments = false;
      this.cdr.detectChanges();
    });
  }

  get filteredAssessments(): Assessment[] {
    return this.filterType ? this.assessments.filter(a => a.type === this.filterType) : this.assessments;
  }

  get passingGrades(): Grade[] {
    return this.grades.filter(g => g.maxScore > 0 && (g.score / g.maxScore) >= 0.5);
  }

  get recentGrades(): Grade[] {
    return [...this.grades].slice(0, 3);
  }

  get upcomingAssessments(): Assessment[] {
    return this.assessments
      .filter(a => a.startDate && new Date(a.startDate).getTime() > Date.now())
      .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime())
      .slice(0, 3);
  }

  get earnedBadgeCount(): number {
    return this.badges.filter(b => b.earned).length;
  }

  get inProgressCourses(): any[] {
    const profile = MOCK_STUDENTS.find(s => s.email === this.studentEmail);
    if (!profile) return [];
    return MOCK_ENROLLMENTS
      .filter(e => e.studentId === profile.id && e.progress < 100)
      .map(e => {
        const course = COURSES.find(c => c.id === e.courseId);
        const lessons = MOCK_LESSONS[e.courseId] ?? [];
        return {
          ...e,
          course,
          totalLessons: lessons.length,
          lessonLabel: `${Math.floor(e.progress / (100 / Math.max(1, lessons.length)))}/${lessons.length} lessons`,
        };
      })
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 3);
  }

  downloadCertificate(g: Grade): void {
    this.generatingCertificate = true;
    this.certificateService.generateCertificate({
      studentName: this.studentName, studentEmail: this.studentEmail,
      examTitle: g.assessmentTitle ?? `Assessment #${g.assessmentId}`,
      score: g.score, maxScore: g.maxScore,
      passedAt: (g as any).submittedAt ?? new Date().toISOString()
    }).subscribe({
      next: () => {
        this.generatingCertificate = false;
        this.toast.success('Certificate generated! Download started.');
        this.cdr.detectChanges();
      },
      error: () => {
        this.generatingCertificate = false;
        this.toast.error('Certificate generation failed.');
        this.cdr.detectChanges();
      }
    });
  }

  getPercentage(g: Grade): number { return Math.round((g.score / g.maxScore) * 1000) / 10; }

  getMention(g: Grade): string {
    const p = this.getPercentage(g);
    if (p >= 90) return 'EXCELLENT';
    if (p >= 75) return 'GOOD';
    if (p >= 60) return 'AVERAGE';
    return 'FAIL';
  }

  mentionClass(mention: string): string {
    const map: Record<string, string> = { EXCELLENT: 'badge-excellent', GOOD: 'badge-good', AVERAGE: 'badge-average', FAIL: 'badge-fail' };
    return map[mention] ?? '';
  }

  barColor(pct: number): string {
    if (pct >= 75) return '#22c55e';
    if (pct >= 60) return '#f59e0b';
    return '#ef4444';
  }

  medalEmoji(rank: number): string {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  }

  isMe(name: string): boolean { return name === this.studentName; }
  isQuiz(a: Assessment): boolean { return a.type === 'QUIZ'; }

  fetchClassDetails(): void {
    if (!this.studentClass) return;
    this.loadingClass = true;
    this.classService.listClasses().pipe(catchError(() => of([]))).subscribe(classes => {
      this.classDetails = classes.find(c => c.name === this.studentClass) ?? null;
      this.loadingClass = false;
      this.cdr.detectChanges();
    });
  }

  typeIcon(type: string): string {
    return { EXAM: '📝', QUIZ: '⚡', PROJECT: '🏗️' }[type] ?? '📋';
  }

  getCountdown(dateStr: string): string {
    const diff = new Date(dateStr).getTime() - Date.now();
    if (diff < 0) return 'Past';
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return `In ${days}d ${hours}h`;
    if (hours > 0) return `In ${hours}h`;
    return 'Soon';
  }

  levelLabel(): string {
    if (this.level <= 2) return 'Beginner';
    if (this.level <= 4) return 'Learner';
    if (this.level <= 6) return 'Achiever';
    if (this.level <= 9) return 'Expert';
    return 'Master';
  }

  toggleAiPanel(): void {
    this.showAiPanel = !this.showAiPanel;
    if (this.showAiPanel && this.aiMessages.length === 0) {
      this.aiMessages = [{ role: 'ai', text: `Hi ${this.studentName.split(' ')[0]}! 👋 I'm your AI study assistant. Ask me about your courses, grades, or study strategies.` }];
    }
  }

  sendAiMessage(): void {
    const text = this.aiInput.trim();
    if (!text) return;
    this.aiMessages.push({ role: 'user', text });
    this.aiInput = '';
    this.aiTyping = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.aiMessages.push({ role: 'ai', text: this.generateAiResponse(text) });
      this.aiTyping = false;
      this.cdr.detectChanges();
    }, 1200 + Math.random() * 800);
  }

  private generateAiResponse(input: string): string {
    const q = input.toLowerCase();
    if (q.includes('grade') || q.includes('score')) {
      return `Your current average is ${this.averagePct}%. ${this.averagePct >= 75 ? 'Great work! Keep it up! 🌟' : 'Focus on reviewing past assessments — consistency is key. 💪'}`;
    }
    if (q.includes('streak') || q.includes('day')) {
      return `You're on a ${this.streak}-day learning streak! 🔥 Keep logging in daily to maintain it and earn bonus XP.`;
    }
    if (q.includes('exam') || q.includes('quiz') || q.includes('test')) {
      const next = this.upcomingAssessments[0];
      return next ? `Your next assessment is "${next.title}" — ${this.getCountdown(next.startDate!)}. I recommend starting revision 2 days ahead! 📚` : "No upcoming assessments at the moment. Great time to review past material! 📖";
    }
    if (q.includes('level') || q.includes('xp')) {
      return `You're Level ${this.level} (${this.levelLabel()}) with ${this.xp} XP. You need ${this.xpToNext - this.xp} more XP to reach Level ${this.level + 1}! 🚀`;
    }
    if (q.includes('help') || q.includes('study') || q.includes('tip')) {
      const tips = [
        "Try the Pomodoro technique: 25 min focus, 5 min break. It boosts retention by 40%! ⏰",
        "Reviewing notes within 24 hours of a lesson increases retention from 40% to 80%! 📝",
        "Practice active recall — test yourself instead of just re-reading. 🧠",
        "Sleep is crucial for memory consolidation. Aim for 7-8 hours before exams! 😴",
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }
    return "Great question! I'm here to help with study strategies, grade insights, and learning recommendations. What specific area would you like to improve? 🎯";
  }
}
