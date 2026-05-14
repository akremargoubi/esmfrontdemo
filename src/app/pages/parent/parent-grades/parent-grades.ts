import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { MOCK_PARENT_CHILDREN, MOCK_GRADES, MOCK_ASSESSMENTS } from '../../../core/mock/mock-data';

@Component({
  selector: 'app-parent-grades',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './parent-grades.html',
  styleUrls: ['./parent-grades.css']
})
export class ParentGradesPage implements OnInit {
  private auth = inject(AuthService);

  children:   any[] = [];
  selected:   any   = null;
  grades:     any[] = [];

  ngOnInit(): void {
    const userId  = this.auth.getUserId() ?? '4';
    this.children = MOCK_PARENT_CHILDREN[userId] ?? MOCK_PARENT_CHILDREN['4'] ?? [];
    if (this.children.length) {
      this.selectChild(this.children[0]);
    }
  }

  selectChild(child: any): void {
    this.selected = child;
    this.grades   = MOCK_GRADES.filter(g => g.studentId === child.id);
  }

  pct(g: any): number { return g.maxScore > 0 ? Math.round((g.score / g.maxScore) * 100) : 0; }

  mention(g: any): string {
    const p = this.pct(g);
    if (p >= 90) return 'EXCELLENT'; if (p >= 75) return 'GOOD';
    if (p >= 60) return 'AVERAGE';   return 'FAIL';
  }

  mentionColor(g: any): string {
    const p = this.pct(g);
    if (p >= 75) return '#16a34a'; if (p >= 60) return '#d97706'; return '#dc2626';
  }
  mentionBg(g: any): string {
    const p = this.pct(g);
    if (p >= 75) return '#dcfce7'; if (p >= 60) return '#fef9c3'; return '#fee2e2';
  }

  barColor(p: number): string {
    if (p >= 75) return '#22c55e'; if (p >= 60) return '#f59e0b'; return '#ef4444';
  }

  get avgScore(): number {
    if (!this.grades.length) return 0;
    return Math.round(this.grades.reduce((s, g) => s + g.score, 0) / this.grades.length);
  }
  get passRate(): number {
    if (!this.grades.length) return 0;
    const passing = this.grades.filter(g => this.pct(g) >= 60).length;
    return Math.round((passing / this.grades.length) * 100);
  }
  get bestScore(): number {
    return this.grades.length ? Math.max(...this.grades.map(g => g.score)) : 0;
  }

  upcomingAssessment(className: string): any | null {
    return MOCK_ASSESSMENTS.find(a => a.className === className && a.status === 'PUBLISHED') ?? null;
  }
}
