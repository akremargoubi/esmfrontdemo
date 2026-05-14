import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { COURSES } from '../../data/courses.data';
import { MOCK_LESSONS, Lesson, QuizQuestion } from '../../core/mock/mock-lessons';
import { MOCK_ENROLLMENTS, MOCK_STUDENTS } from '../../core/mock/mock-data';
import { AuthService } from '../../core/services/auth.service';

const PROGRESS_STORE = new Map<string, Set<number>>();

function initProgress(courseId: number): void {
  if (!PROGRESS_STORE.has(`c${courseId}`)) {
    PROGRESS_STORE.set(`c${courseId}`, new Set());
  }
}

function isLessonCompleted(courseId: number, lessonId: number): boolean {
  return PROGRESS_STORE.get(`c${courseId}`)?.has(lessonId) ?? false;
}

function toggleLesson(courseId: number, lessonId: number): boolean {
  const set = PROGRESS_STORE.get(`c${courseId}`);
  if (!set) return false;
  if (set.has(lessonId)) { set.delete(lessonId); return false; }
  set.add(lessonId); return true;
}

function getProgress(courseId: number, total: number): number {
  if (total === 0) return 0;
  const completed = PROGRESS_STORE.get(`c${courseId}`)?.size ?? 0;
  return Math.round((completed / total) * 100);
}

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private auth = inject(AuthService);
  private sanitizer = inject(DomSanitizer);

  course: any = null;
  lessons: Lesson[] = [];
  activeLesson: Lesson | null = null;
  isEnrolled = false;

  // Quiz state
  quizAnswers: Record<number, number> = {};
  quizSubmitted = false;
  quizScore = 0;
  quizTotal = 0;
  quizPassed = false;

  // UI state
  showVideo = false;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.course = COURSES.find(c => c.id === id);
    if (this.course) {
      this.lessons = MOCK_LESSONS[id] ?? [];
      initProgress(id);
      if (this.lessons.length > 0) {
        this.activeLesson = this.lessons[0];
      }

      const email = this.auth.getEmail() ?? '';
      const student = MOCK_STUDENTS.find(s => s.email === email);
      if (student) {
        this.isEnrolled = MOCK_ENROLLMENTS.some(e => e.studentId === student.id && e.courseId === id);
      }
    }
  }

  get progress(): number {
    return getProgress(this.course?.id ?? 0, this.lessons.length);
  }

  get completedCount(): number {
    return PROGRESS_STORE.get(`c${this.course?.id}`)?.size ?? 0;
  }

  selectLesson(lesson: Lesson): void {
    this.activeLesson = lesson;
    this.showVideo = false;
    this.resetQuiz();
  }

  get completedLessons(): Set<number> {
    return PROGRESS_STORE.get(`c${this.course?.id}`) ?? new Set();
  }

  markComplete(): void {
    if (!this.activeLesson) return;
    const courseId = this.course?.id ?? 0;
    toggleLesson(courseId, this.activeLesson.id);
    this.cdr.detectChanges();

    const email = this.auth.getEmail() ?? '';
    const student = MOCK_STUDENTS.find(s => s.email === email);
    const enrollment = MOCK_ENROLLMENTS.find(e => e.studentId === student?.id && e.courseId === courseId);
    if (enrollment) {
      enrollment.progress = getProgress(courseId, this.lessons.length);
    }
  }

  get quizAnsweredCount(): number {
    return Object.keys(this.quizAnswers).length;
  }

  // ── Quiz ─────────────────────────────────────────────────────────────────

  get activeQuiz(): QuizQuestion[] | null {
    return this.activeLesson?.quiz?.questions ?? null;
  }

  selectAnswer(questionId: number, optionIndex: number): void {
    if (this.quizSubmitted) return;
    this.quizAnswers[questionId] = optionIndex;
  }

  submitQuiz(): void {
    const questions = this.activeQuiz;
    if (!questions) return;
    this.quizTotal = questions.length;
    this.quizScore = questions.filter(q => this.quizAnswers[q.id] === q.correctIndex).length;
    this.quizSubmitted = true;
    this.quizPassed = this.quizScore >= Math.ceil(this.quizTotal / 2);

    if (this.quizPassed && this.activeLesson) {
      const courseId = this.course?.id ?? 0;
      const set = PROGRESS_STORE.get(`c${courseId}`);
      if (set) set.add(this.activeLesson.id);
      this.cdr.detectChanges();
    }
  }

  private resetQuiz(): void {
    this.quizAnswers = {};
    this.quizSubmitted = false;
    this.quizScore = 0;
    this.quizTotal = 0;
    this.quizPassed = false;
  }

  isCorrect(questionId: number, optionIndex: number): boolean {
    if (!this.quizSubmitted) return false;
    const q = this.activeQuiz?.find(qq => qq.id === questionId);
    return q?.correctIndex === optionIndex;
  }

  isWrong(questionId: number, optionIndex: number): boolean {
    if (!this.quizSubmitted) return false;
    const q = this.activeQuiz?.find(qq => qq.id === questionId);
    return this.quizAnswers[questionId] === optionIndex && q?.correctIndex !== optionIndex;
  }

  progressColor(pct: number): string {
    if (pct >= 100) return '#22c55e';
    if (pct >= 50) return '#6366f1';
    return '#f59e0b';
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
