import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_ML } from '../core/mock/mock-data';

// ── Helpers ────────────────────────────────────────────────────────────────────
function avatarColor(name: string): string {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6'];
  let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
}

function initials(name: string): string {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
}

function sparkTrend(base: number, n = 8): number[] {
  return Array.from({ length: n }, () => +(base + (Math.random() - 0.5) * 0.15).toFixed(2));
}

@Injectable({ providedIn: 'root' })
export class MlService {

  buildDataset(): Observable<any> {
    return of({ status: 'success', rows: 74, message: 'Dataset built (mock).' }).pipe(delay(1200));
  }

  datasetStatus(): Observable<any> {
    return of({ ready: true, lastBuilt: new Date().toISOString() }).pipe(delay(200));
  }

  // ── DSO1 ──────────────────────────────────────────────────────────────────
  dso1Summary(): Observable<any> {
    const s = MOCK_ML.dso1Summary;
    return of({
      total_students:       s.totalStudents,
      critical_count:       s.criticalCount,
      high_count:           s.highCount,
      moderate_count:       s.moderateCount,
      low_count:            s.lowCount,
      overall_dropout_rate: s.overallDropoutRate,
      retention_rate:       s.retentionRate,
      probability_distribution: [
        { label: '0–20%',  count: 22, color: '#22c55e' },
        { label: '20–40%', count: 18, color: '#84cc16' },
        { label: '40–60%', count: 16, color: '#f59e0b' },
        { label: '60–80%', count: 11, color: '#ef4444' },
        { label: '80–100%',count: 7,  color: '#991b1b' },
      ],
    }).pipe(delay(300));
  }

  dso1Students(riskLevel = 'all', level = 'all', search = ''): Observable<any[]> {
    let data = MOCK_ML.dso1Students.map(s => ({
      id:             s.id,
      name:           s.name,
      initials:       initials(s.name),
      avatar_color:   avatarColor(s.name),
      email:          `${s.name.toLowerCase().replace(' ', '.')}@school.tn`,
      level:          s.level,
      class_name:     s.className,
      dropout_prob:   s.predictedDropout,
      absence_rate:   s.absenceRate,
      risk_level:     s.riskLevel.toLowerCase(),
      note_moyenne:   +(14 - s.predictedDropout * 10 + Math.random() * 2).toFixed(1),
      trend:          sparkTrend(s.predictedDropout),
      flags:          s.predictedDropout > 0.6 ? ['absence', 'note'] : s.predictedDropout > 0.4 ? ['absence'] : [],
    }));
    if (riskLevel !== 'all') data = data.filter(s => s.risk_level === riskLevel.toLowerCase());
    if (level     !== 'all') data = data.filter(s => s.level === level);
    if (search) data = data.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
    return of(data).pipe(delay(300));
  }

  dso1WeeklyTrend(_weeks = 8): Observable<any> {
    const rates = MOCK_ML.dso1WeeklyTrend.map(w => w.dropoutRate);
    return of({
      weeks:        MOCK_ML.dso1WeeklyTrend.map(w => w.week),
      dropout_rate: rates,
      total_risk:   MOCK_ML.dso1Summary.criticalCount + MOCK_ML.dso1Summary.highCount,
    }).pipe(delay(300));
  }

  dso1Funnel(): Observable<any> {
    return of({
      stages: [
        { label: 'Enrolled',                 count: 74, color: '#6366f1' },
        { label: 'Active (>75% attendance)', count: 58, color: '#3b82f6' },
        { label: 'Passing grades',           count: 47, color: '#f59e0b' },
        { label: 'On track to complete',     count: 41, color: '#22c55e' },
      ],
    }).pipe(delay(300));
  }

  dso1RetentionByLevel(): Observable<any[]> {
    return of([
      { level: 'A1', retention_rate: 0.95, count: 12 },
      { level: 'A2', retention_rate: 0.92, count: 20 },
      { level: 'B1', retention_rate: 0.87, count: 18 },
      { level: 'B2', retention_rate: 0.83, count: 15 },
      { level: 'C1', retention_rate: 0.79, count: 9  },
    ]).pipe(delay(300));
  }

  dso1Scatter(_maxPoints = 150): Observable<any> {
    const pts = MOCK_ML.dso1Students.map(s => ({
      x:    +(s.absenceRate      + (Math.random() - 0.5) * 0.04).toFixed(3),
      y:    +(s.predictedDropout + (Math.random() - 0.5) * 0.04).toFixed(3),
      name: s.name,
      risk: s.riskLevel.toLowerCase(),
    }));
    return of({ points: pts, trend_line: { x1: 0.02, y1: 0.05, x2: 0.50, y2: 0.92 }, correlation: 0.78 }).pipe(delay(300));
  }

  dso1FeatureCorrelation(): Observable<any[]> {
    return of([
      { feature: 'Absence Rate',      correlation:  0.82 },
      { feature: 'Assignment Missed', correlation:  0.74 },
      { feature: 'Grade Average',     correlation: -0.68 },
      { feature: 'Payment Delays',    correlation:  0.51 },
      { feature: 'Course Difficulty', correlation:  0.44 },
      { feature: 'Class Size',        correlation:  0.21 },
    ]).pipe(delay(300));
  }

  // ── DSO2 ──────────────────────────────────────────────────────────────────
  dso2Students(search = '', level = 'all', status = 'all'): Observable<any[]> {
    let data = MOCK_ML.dso2Students.map(s => {
      const grade = s.currentGrade;
      const pred  = s.predictedGrade;
      const delta = +(pred - grade).toFixed(1);
      return {
        id:              s.id,
        name:            s.name,
        initials:        initials(s.name),
        avatar_color:    avatarColor(s.name),
        level:           s.level,
        class_name:      s.className,
        current_avg:     grade,
        predicted_grade: pred,
        delta,
        ci_low:          +(pred - 3).toFixed(1),
        ci_high:         +(pred + 3).toFixed(1),
        confidence:      s.confidence,
        status:          s.status.toLowerCase(),
        trend:           sparkTrend(grade / 100, 8).map(v => +(v * 100).toFixed(0)),
        direction:       delta >= 0 ? 'up' : 'down',
        bar_width_pct:   Math.min(100, grade),
      };
    });
    if (level  !== 'all') data = data.filter(s => s.level  === level);
    if (status !== 'all') data = data.filter(s => s.status === status.toLowerCase());
    if (search) data = data.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
    return of(data).pipe(delay(300));
  }

  dso2Distribution(_level = 'all'): Observable<any> {
    return of({
      cohort_avg:    76.4,
      cohort_median: 78.0,
      fail_rate:     0.083,
      buckets: [
        { range: '< 40',   count: 2,  color: '#dc2626' },
        { range: '40–50',  count: 4,  color: '#ea580c' },
        { range: '50–60',  count: 8,  color: '#7c3aed' },
        { range: '60–70',  count: 18, color: '#2563eb' },
        { range: '70–80',  count: 22, color: '#16a34a' },
        { range: '80–90',  count: 14, color: '#15803d' },
        { range: '90–100', count: 6,  color: '#166534' },
      ],
    }).pipe(delay(300));
  }

  dso2TopDeclining(): Observable<any[]> {
    return of(
      MOCK_ML.dso2Students
        .filter(s => s.status === 'DECLINING')
        .slice(0, 5)
        .map(s => ({
          name:            s.name,
          predicted_grade: s.predictedGrade,
          delta:           +(s.predictedGrade - s.currentGrade).toFixed(1),
          direction:       s.predictedGrade >= s.currentGrade ? 'up' : 'down',
          bar_width_pct:   Math.min(100, s.currentGrade),
        }))
    ).pipe(delay(300));
  }

  // ── DSO3 ──────────────────────────────────────────────────────────────────
  dso3Clusters(): Observable<any[]> {
    const bgMap: Record<number, string> = { 0: '#f0fdf4', 1: '#eff6ff', 2: '#fffbeb', 3: '#fef2f2' };
    const textMap: Record<number, string> = { 0: '#166534', 1: '#1d4ed8', 2: '#92400e', 3: '#991b1b' };
    return of(MOCK_ML.dso3Clusters.map(c => ({
      cluster_id:        c.id,
      label:             c.label,
      count:             c.count,
      percentage:        c.percentage / 100,
      color:             c.color,
      bg_color:          bgMap[c.id] ?? '#f8fafc',
      text_color:        textMap[c.id] ?? '#1e293b',
      avg_absence_pct:   +(c.avgAbsence * 100),
      avg_note:          +(c.avgGrade / 5).toFixed(1),
      avg_retard_days:   c.paymentDelay,
      dropout_rate:      c.dropoutRate,
      payment_risk_rate: +(c.dropoutRate * 0.8 + 0.05).toFixed(2),
    }))).pipe(delay(300));
  }

  dso3Students(cluster = 'all', level = 'all', search = ''): Observable<any[]> {
    const clusterLabels = ['High Performers', 'Average Students', 'At-Risk Group', 'Critical Cases'];
    const clusterBgs    = ['#dcfce7', '#dbeafe', '#fef9c3', '#fee2e2'];
    const clusterTexts  = ['#166534', '#1d4ed8', '#92400e', '#991b1b'];
    let data = MOCK_ML.dso1Students.map((s, i) => {
      const cl = i % 4;
      return {
        id:            s.id,
        name:          s.name,
        initials:      initials(s.name),
        avatar_color:  avatarColor(s.name),
        email:         `${s.name.toLowerCase().replace(' ', '.')}@school.tn`,
        level:         s.level,
        class_name:    s.className,
        cluster:       cl,
        cluster_label: clusterLabels[cl],
        cluster_bg:    clusterBgs[cl],
        cluster_text:  clusterTexts[cl],
        absence_pct:   `${(s.absenceRate * 100).toFixed(0)}%`,
        note:          +(14 - s.predictedDropout * 10).toFixed(1),
        retard_jours:  Math.round(s.predictedDropout * 30),
        pc1:           +((Math.random() - 0.5) * 4).toFixed(2),
        pc2:           +((Math.random() - 0.5) * 3).toFixed(2),
      };
    });
    if (search) data = data.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
    return of(data).pipe(delay(300));
  }

  dso3Pca(): Observable<any> {
    const clusterColors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];
    const points = MOCK_ML.dso1Students.map((s, i) => ({
      x:       +((Math.random() - 0.5) * 6).toFixed(2),
      y:       +((Math.random() - 0.5) * 4).toFixed(2),
      name:    s.name,
      cluster: i % 4,
    }));
    const centroids = MOCK_ML.dso3Clusters.map((_, i) => ({
      x:       +((Math.random() - 0.5) * 4).toFixed(2),
      y:       +((Math.random() - 0.5) * 3).toFixed(2),
      cluster: i,
    }));
    return of({
      points,
      centroids,
      variance_explained:  [0.48, 0.31],
      silhouette_score:    0.64,
    }).pipe(delay(300));
  }

  dso3Summary(): Observable<any> {
    return of({
      silhouette_score:       0.64,
      variance_explained_pc1: 0.48,
      variance_explained_pc2: 0.31,
      k: 4,
    }).pipe(delay(200));
  }

  // ── DSO4 ──────────────────────────────────────────────────────────────────
  dso4Summary(): Observable<any> {
    const s = MOCK_ML.dso4Summary;
    const students = MOCK_ML.dso4Students;
    const overdue = students.reduce((sum, st) => sum + st.overdueAmount, 0);
    const delays  = students.filter(st => st.delayDays > 0);
    const total = students.length;
    const hi    = s.highRiskCount;
    const med   = 3;
    const lo    = total - hi - med;
    return of({
      total_students:         total,
      high_risk_count:        hi,
      medium_risk_count:      med,
      low_risk_count:         lo,
      overdue_total_tnd:      overdue,
      avg_delay_days:         delays.length ? Math.round(delays.reduce((a, b) => a + b.delayDays, 0) / delays.length) : 0,
      overdue_60_days_count:  s.sixtyPlusDays,
      collection_rate:        s.collectionRate,
      total_overdue_students: delays.length,
      donut: {
        high:   { percentage: hi / total },
        medium: { percentage: med / total },
        low:    { percentage: lo  / total },
      },
      aging_buckets: [
        { range: '0–30',  count: 8, color: '#22c55e' },
        { range: '30–60', count: 5, color: '#f59e0b' },
        { range: '60–90', count: 3, color: '#ef4444' },
        { range: '90+',   count: 2, color: '#991b1b' },
      ],
    }).pipe(delay(300));
  }

  dso4Students(riskLevel = 'all', level = 'all', search = ''): Observable<any[]> {
    let data = MOCK_ML.dso4Students.map(s => ({
      id:                s.id,
      name:              s.name,
      initials:          initials(s.name),
      avatar_color:      avatarColor(s.name),
      email:             `${s.name.toLowerCase().replace(' ', '.')}@school.tn`,
      level:             s.level,
      class_name:        s.className,
      risk_score:        s.riskScore,
      risk_level:        s.riskLevel.toLowerCase(),
      overdue_amount:    s.overdueAmount,
      overdue_tnd:       s.overdueAmount,
      delay_days:        s.delayDays,
      risk_pct:          Math.round(s.riskScore * 100),
      last_payment_date: s.overdueAmount > 0 ? 'Jan 2025' : 'Apr 2025',
    }));
    if (riskLevel !== 'all') data = data.filter(s => s.risk_level === riskLevel.toLowerCase());
    if (level     !== 'all') data = data.filter(s => s.level === level);
    if (search) data = data.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
    return of(data).pipe(delay(300));
  }

  dso4Export(): Observable<Blob> {
    const csv = ['ID,Name,Level,Risk Score,Risk Level,Overdue Amount,Delay Days',
      ...MOCK_ML.dso4Students.map(s =>
        `${s.id},${s.name},${s.level},${s.riskScore},${s.riskLevel},${s.overdueAmount},${s.delayDays}`)
    ].join('\n');
    return of(new Blob([csv], { type: 'text/csv' })).pipe(delay(300));
  }
}
