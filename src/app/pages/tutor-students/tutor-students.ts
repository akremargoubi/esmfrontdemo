import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import {
  MOCK_CLASSES, MOCK_STUDENTS, MOCK_GRADES, MOCK_ATTENDANCE, MOCK_ML
} from '../../core/mock/mock-data';

const TUTOR_ID = '2';

interface TutorNote { studentId: number; text: string; timestamp: Date; }

let tutorNotes: TutorNote[] = [];

@Component({
  selector: 'app-tutor-students',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  templateUrl: './tutor-students.html',
  styleUrls: ['./tutor-students.css']
})
export class TutorStudents implements OnInit {
  myClasses:    any[] = [];
  allStudents:  any[] = [];
  filtered:     any[] = [];

  selectedClass = 'ALL';
  searchTerm    = '';
  sortBy        = 'name';

  selectedStudent: any = null;
  showDetail      = false;
  noteText        = '';
  noteSaved       = false;

  ngOnInit(): void {
    this.myClasses = MOCK_CLASSES.filter(c => c.tutorId === TUTOR_ID);
    const classNames = this.myClasses.map(c => c.name);

    this.allStudents = MOCK_STUDENTS
      .filter(s => classNames.includes(s.className))
      .map(s => {
        const grades  = MOCK_GRADES.filter(g => g.studentId === s.id);
        const att     = MOCK_ATTENDANCE.filter(a => a.studentId === s.id);
        const present = att.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
        const avgScore = grades.length
          ? Math.round(grades.reduce((sum, g) => sum + g.score, 0) / grades.length) : 0;
        const attRate  = att.length ? Math.round((present / att.length) * 100) : 100;
        const ml = (MOCK_ML as any).dso1Students?.find((m: any) => m.id === s.id);
        const ml2 = (MOCK_ML as any).dso2Students?.find((m: any) => m.id === s.id);

        const strengths = this.detectStrengths(grades);
        const weaknesses = this.detectWeaknesses(grades);

        const existingNote = tutorNotes.find(n => n.studentId === s.id);

        return {
          ...s,
          grades, att, avgScore, attRate,
          riskLevel: ml?.riskLevel ?? null,
          predictedDropout: ml?.predictedDropout ?? 0,
          trend: ml2?.trend ?? null,
          predictedGrade: ml2?.predictedGrade ?? null,
          confidence: ml2?.confidence ?? null,
          strengths,
          weaknesses,
          tutorNote: existingNote?.text || '',
          intervention: this.generateIntervention(ml?.riskLevel, ml2?.trend),
        };
      });

    this.applyFilters();
  }

  private detectStrengths(grades: any[]): string[] {
    const s: string[] = [];
    const highScores = grades.filter(g => g.score >= 80);
    if (highScores.length >= 2) s.push('Reading');
    if (highScores.some(g => g.assessmentTitle?.toLowerCase().includes('grammar'))) s.push('Grammar');
    if (highScores.some(g => g.assessmentTitle?.toLowerCase().includes('vocab'))) s.push('Vocabulary');
    if (highScores.some(g => g.assessmentTitle?.toLowerCase().includes('writing'))) s.push('Writing');
    if (s.length === 0 && grades.length > 0) s.push('Participation');
    if (s.length === 0) s.push('—');
    return s;
  }

  private detectWeaknesses(grades: any[]): string[] {
    const w: string[] = [];
    const lowScores = grades.filter(g => g.score < 70);
    if (lowScores.length >= 2) w.push('Reading');
    if (lowScores.some(g => g.assessmentTitle?.toLowerCase().includes('grammar'))) w.push('Grammar');
    if (lowScores.some(g => g.assessmentTitle?.toLowerCase().includes('vocab'))) w.push('Vocabulary');
    if (lowScores.some(g => g.assessmentTitle?.toLowerCase().includes('writing'))) w.push('Writing');
    if (w.length === 0 && grades.length > 0) w.push('None detected');
    if (w.length === 0) w.push('—');
    return w;
  }

  private generateIntervention(riskLevel: string | null, trend: string | null): string {
    if (riskLevel === 'CRITICAL') return 'Schedule parent meeting immediately. Consider 1-on-1 tutoring sessions.';
    if (riskLevel === 'HIGH') return 'Increase check-ins to twice weekly. Monitor assignment submission.';
    if (trend === 'DECLINING') return 'Review recent assessments. Suggest peer tutoring or extra practice.';
    if (riskLevel === 'MODERATE') return 'Regular progress monitoring. Encourage class participation.';
    return 'Continue current approach. Student is on track.';
  }

  applyFilters(): void {
    const q = this.searchTerm.toLowerCase();
    let list = this.allStudents.filter(s => {
      const matchClass = this.selectedClass === 'ALL' || s.className === this.selectedClass;
      const matchSearch = !q
        || `${s.firstName} ${s.lastName}`.toLowerCase().includes(q)
        || s.email.toLowerCase().includes(q);
      return matchClass && matchSearch;
    });

    if (this.sortBy === 'name')   list = list.sort((a, b) => a.firstName.localeCompare(b.firstName));
    if (this.sortBy === 'grade')  list = list.sort((a, b) => b.avgScore - a.avgScore);
    if (this.sortBy === 'att')    list = list.sort((a, b) => b.attRate - a.attRate);
    if (this.sortBy === 'risk')   list = list.sort((a, b) => b.predictedDropout - a.predictedDropout);

    this.filtered = list;
  }

  openDetail(s: any): void {
    this.selectedStudent = s;
    this.showDetail = true;
    this.noteText = s.tutorNote || '';
    this.noteSaved = false;
  }
  closeDetail(): void { this.showDetail = false; this.selectedStudent = null; }

  saveNote(): void {
    if (!this.selectedStudent) return;
    const existing = tutorNotes.findIndex(n => n.studentId === this.selectedStudent.id);
    const note = { studentId: this.selectedStudent.id, text: this.noteText, timestamp: new Date() };
    if (existing >= 0) {
      tutorNotes[existing] = note;
    } else {
      tutorNotes.push(note);
    }
    this.selectedStudent.tutorNote = this.noteText;
    this.noteSaved = true;
    setTimeout(() => this.noteSaved = false, 2000);
  }

  sendMessage(s: any): void {
    alert(`[Demo] Message sent to ${s.firstName} ${s.lastName}'s parent`);
  }

  gradeColor(n: number): string {
    if (n >= 85) return '#16a34a'; if (n >= 70) return '#d97706'; return '#dc2626';
  }
  gradeBarColor(n: number): string {
    if (n >= 85) return '#22c55e'; if (n >= 70) return '#f59e0b'; return '#ef4444';
  }

  riskColor(l: string): string {
    return ({ CRITICAL: '#dc2626', HIGH: '#ea580c', MODERATE: '#d97706', LOW: '#16a34a' } as any)[l] ?? '#94a3b8';
  }
  riskBg(l: string): string {
    return ({ CRITICAL: '#fee2e2', HIGH: '#ffedd5', MODERATE: '#fef3c7', LOW: '#dcfce7' } as any)[l] ?? '#f1f5f9';
  }

  countInClass(name: string): number {
    return this.allStudents.filter(s => s.className === name).length;
  }

  classAvgScore(name: string): number {
    const grades = MOCK_GRADES.filter(g => g.className === name);
    return grades.length ? Math.round(grades.reduce((s, g) => s + g.score, 0) / grades.length) : 0;
  }
}
