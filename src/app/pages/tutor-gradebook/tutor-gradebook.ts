import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import {
  MOCK_CLASSES, MOCK_STUDENTS, MOCK_ASSESSMENTS, MOCK_GRADES
} from '../../core/mock/mock-data';
import { ToastService } from '../../services/toast.service';
import { inject } from '@angular/core';

const TUTOR_ID = '2';

@Component({
  selector: 'app-tutor-gradebook',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  templateUrl: './tutor-gradebook.html',
  styleUrls: ['./tutor-gradebook.css']
})
export class TutorGradebook implements OnInit {
  private toast = inject(ToastService);

  myClasses:    any[] = [];
  selectedClass = '';

  students:     any[] = [];
  assessments:  any[] = [];
  gradeMatrix:  Record<string, Record<number, any>> = {};

  editingCell: { studentId: number; assessmentId: number } | null = null;
  editValue = '';

  feedbackCell: { studentId: number; assessmentId: number } | null = null;
  feedbackValue = '';

  bulkScore = '';
  showBulkGrading = false;

  saving = false;
  showDistrib = false;

  ngOnInit(): void {
    this.myClasses = MOCK_CLASSES.filter(c => c.tutorId === TUTOR_ID);
    if (this.myClasses.length) {
      this.selectedClass = this.myClasses[0].name;
      this.buildMatrix();
    }
  }

  buildMatrix(): void {
    const cn = this.selectedClass;
    this.students    = MOCK_STUDENTS.filter(s => s.className === cn);
    this.assessments = MOCK_ASSESSMENTS.filter(a => a.className === cn);

    this.gradeMatrix = {};
    for (const s of this.students) {
      this.gradeMatrix[s.id] = {};
      for (const a of this.assessments) {
        const g = MOCK_GRADES.find(g => g.studentId === s.id && g.assessmentId === a.id);
        this.gradeMatrix[s.id][a.id] = g ? { ...g } : null;
      }
    }
    this.showDistrib = this.assessments.length === 1;
  }

  onClassChange(): void { this.buildMatrix(); this.editingCell = null; this.feedbackCell = null; }

  startEdit(studentId: number, assessmentId: number): void {
    const g = this.gradeMatrix[studentId]?.[assessmentId];
    this.editingCell = { studentId, assessmentId };
    this.editValue   = g ? String(g.score) : '';
  }

  commitEdit(studentId: number, assessmentId: number): void {
    if (!this.editingCell) return;
    const score = parseInt(this.editValue, 10);
    const a = this.assessments.find(x => x.id === assessmentId);
    const s = this.students.find(x => x.id === studentId);

    if (!isNaN(score) && score >= 0 && score <= (a?.maxScore ?? 100)) {
      const gradeRec = {
        id: Date.now(), studentId, studentName: `${s.firstName} ${s.lastName}`,
        assessmentId, assessmentTitle: a?.title,
        score, maxScore: a?.maxScore ?? 100,
        grade: this.scoreToGrade(score),
        courseName: a?.courseName ?? '',
        className: this.selectedClass,
        submittedAt: new Date().toISOString(),
      };
      this.gradeMatrix[studentId][assessmentId] = { ...gradeRec, feedback: '' };
      MOCK_GRADES.push(gradeRec);
      this.toast.success(`Grade saved: ${s.firstName} — ${score}`);
    }
    this.editingCell = null;
    this.editValue   = '';
  }

  cancelEdit(): void { this.editingCell = null; this.editValue = ''; }

  startFeedback(studentId: number, assessmentId: number): void {
    const g = this.gradeMatrix[studentId]?.[assessmentId];
    this.feedbackCell = { studentId, assessmentId };
    this.feedbackValue = g?.feedback || '';
  }

  saveFeedback(): void {
    if (!this.feedbackCell) return;
    const { studentId, assessmentId } = this.feedbackCell;
    const g = this.gradeMatrix[studentId]?.[assessmentId];
    if (g) {
      g.feedback = this.feedbackValue;
      this.toast.success('Feedback saved');
    }
    this.feedbackCell = null;
    this.feedbackValue = '';
  }

  cancelFeedback(): void { this.feedbackCell = null; this.feedbackValue = ''; }

  applyBulkGrade(): void {
    const score = parseInt(this.bulkScore, 10);
    if (isNaN(score)) return;
    const a = this.assessments[0];
    if (!a) return;
    for (const s of this.students) {
      this.gradeMatrix[s.id][a.id] = {
        id: Date.now() + s.id, studentId: s.id, studentName: `${s.firstName} ${s.lastName}`,
        assessmentId: a.id, assessmentTitle: a?.title,
        score, maxScore: a?.maxScore ?? 100,
        grade: this.scoreToGrade(score),
        className: this.selectedClass,
        feedback: '',
      };
    }
    this.bulkScore = '';
    this.showBulkGrading = false;
    this.toast.success(`Bulk grade applied: ${score} to ${this.students.length} students`);
  }

  saveAll(): void {
    this.saving = true;
    setTimeout(() => {
      this.saving = false;
      this.toast.success('Grade book saved successfully.');
    }, 800);
  }

  scoreToGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'C+';
    if (score >= 65) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  studentAvg(studentId: number): number {
    const grades = this.assessments
      .map(a => this.gradeMatrix[studentId]?.[a.id])
      .filter(Boolean);
    return grades.length ? Math.round(grades.reduce((s, g) => s + g.score, 0) / grades.length) : 0;
  }

  assessmentAvg(assessmentId: number): number {
    const grades = this.students
      .map(s => this.gradeMatrix[s.id]?.[assessmentId])
      .filter(Boolean);
    return grades.length ? Math.round(grades.reduce((s, g) => s + g.score, 0) / grades.length) : 0;
  }

  get distribution(): { range: string; count: number; color: string }[] {
    const allGrades = this.students.flatMap(s =>
      this.assessments.map(a => this.gradeMatrix[s.id]?.[a.id]).filter(Boolean)
    );
    const ranges = [
      { range: '90-100', color: '#16a34a' },
      { range: '80-89', color: '#22c55e' },
      { range: '70-79', color: '#d97706' },
      { range: '60-69', color: '#ea580c' },
      { range: '0-59', color: '#dc2626' },
    ];
    return ranges.map(r => ({
      ...r,
      count: allGrades.filter(g => {
        const s = g.score;
        if (r.range === '90-100') return s >= 90;
        if (r.range === '80-89') return s >= 80 && s < 90;
        if (r.range === '70-79') return s >= 70 && s < 80;
        if (r.range === '60-69') return s >= 60 && s < 70;
        return s < 60;
      }).length
    }));
  }

  get totalGraded(): number {
    return this.students.reduce((sum, s) =>
      sum + this.assessments.filter(a => this.gradeMatrix[s.id]?.[a.id]).length, 0
    );
  }

  gradeColor(n: number): string {
    if (!n) return '#94a3b8';
    if (n >= 85) return '#16a34a'; if (n >= 70) return '#d97706'; return '#dc2626';
  }

  isEditing(sId: number, aId: number): boolean {
    return this.editingCell?.studentId === sId && this.editingCell?.assessmentId === aId;
  }

  isFeedback(sId: number, aId: number): boolean {
    return this.feedbackCell?.studentId === sId && this.feedbackCell?.assessmentId === aId;
  }
}
