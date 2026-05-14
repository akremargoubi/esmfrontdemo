import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_GRADES, MOCK_STUDENTS } from '../core/mock/mock-data';

export interface Grade {
  id?: number;
  assessmentId: number;
  assessmentTitle?: string;
  studentId?: number;
  studentName: string;
  studentEmail?: string;
  courseName?: string;
  className?: string;
  score: number;
  maxScore: number;
  grade?: string;
  comments?: string;
  gradedAt?: string;
  submittedAt?: string;
  percentage?: number;
  mention?: string;
}

export interface GradeStats {
  total: number; average: number; max: number; min: number;
  passing: number; failing: number; passRate: number;
}

export interface LeaderboardEntry {
  rank: number; studentName: string; studentEmail: string;
  averagePercentage?: number; averageScore?: number; totalAssessments?: number;
  score?: number; maxScore?: number; percentage?: number; mention: string; comments?: string;
}

let _grades: Grade[] = [...MOCK_GRADES];

@Injectable({ providedIn: 'root' })
export class GradeService {

  getAll(): Observable<Grade[]> { return of([..._grades]).pipe(delay(250)); }

  getById(id: number): Observable<Grade> {
    return of(_grades.find(g => g.id === id) ?? _grades[0]).pipe(delay(200));
  }

  getByAssessment(assessmentId: number): Observable<Grade[]> {
    return of(_grades.filter(g => g.assessmentId === assessmentId)).pipe(delay(200));
  }

  getByStudent(email: string): Observable<Grade[]> {
    const student = MOCK_STUDENTS.find(s => s.email === email);
    const grades = student
      ? _grades.filter(g => g.studentId === student.id || g.studentEmail === email)
      : _grades.filter(g => g.studentEmail === email);
    const mapped = grades.map(g => ({ ...g, gradedAt: g.gradedAt ?? g.submittedAt }));
    return of(mapped).pipe(delay(200));
  }

  getStatsByAssessment(assessmentId: number): Observable<GradeStats> {
    const gs = _grades.filter(g => g.assessmentId === assessmentId);
    const scores = gs.map(g => (g.score / g.maxScore) * 100);
    const passing = scores.filter(s => s >= 50).length;
    const stats: GradeStats = {
      total: gs.length,
      average: scores.length ? +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0,
      max: scores.length ? +Math.max(...scores).toFixed(1) : 0,
      min: scores.length ? +Math.min(...scores).toFixed(1) : 0,
      passing, failing: gs.length - passing,
      passRate: gs.length ? +(passing / gs.length * 100).toFixed(1) : 0,
    };
    return of(stats).pipe(delay(200));
  }

  getGlobalLeaderboard(): Observable<LeaderboardEntry[]> {
    const map = new Map<string, { total: number; sum: number; count: number }>();
    _grades.forEach(g => {
      const key = g.studentName;
      const pct = (g.score / g.maxScore) * 100;
      if (!map.has(key)) map.set(key, { total: 0, sum: 0, count: 0 });
      const e = map.get(key)!;
      e.sum += pct; e.count++; e.total++;
    });
    const entries: LeaderboardEntry[] = Array.from(map.entries())
      .map(([name, d]) => ({
        rank: 0, studentName: name, studentEmail: '',
        averagePercentage: +(d.sum / d.count).toFixed(1),
        totalAssessments: d.total,
        mention: d.sum / d.count >= 85 ? 'Excellent' : d.sum / d.count >= 70 ? 'Good' : 'Pass',
      }))
      .sort((a, b) => (b.averagePercentage ?? 0) - (a.averagePercentage ?? 0))
      .map((e, i) => ({ ...e, rank: i + 1 }));
    return of(entries).pipe(delay(250));
  }

  getLeaderboardByAssessment(assessmentId: number): Observable<LeaderboardEntry[]> {
    const gs = _grades.filter(g => g.assessmentId === assessmentId);
    const entries: LeaderboardEntry[] = gs
      .map(g => ({
        rank: 0, studentName: g.studentName, studentEmail: g.studentEmail ?? '',
        score: g.score, maxScore: g.maxScore,
        percentage: +(g.score / g.maxScore * 100).toFixed(1),
        mention: g.score / g.maxScore >= 0.85 ? 'Excellent' : g.score / g.maxScore >= 0.7 ? 'Good' : 'Pass',
      }))
      .sort((a, b) => (b.percentage ?? 0) - (a.percentage ?? 0))
      .map((e, i) => ({ ...e, rank: i + 1 }));
    return of(entries).pipe(delay(200));
  }

  create(grade: Grade): Observable<Grade> {
    const created = { ...grade, id: Math.max(0, ..._grades.map(g => g.id ?? 0)) + 1 };
    _grades = [..._grades, created];
    return of(created).pipe(delay(400));
  }

  update(id: number, grade: Grade): Observable<Grade> {
    const updated = { ...grade, id };
    _grades = _grades.map(g => g.id === id ? updated : g);
    return of(updated).pipe(delay(400));
  }

  delete(id: number): Observable<{ status: number }> {
    _grades = _grades.filter(g => g.id !== id);
    return of({ status: 204 }).pipe(delay(300));
  }
}
