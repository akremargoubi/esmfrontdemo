import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MlService } from '../../services/ml.service';
import { DropoutScatter3dComponent } from './dropout-scatter-3d';
import { catchError, forkJoin, of } from 'rxjs';

type Tab = 'dso1' | 'dso2' | 'dso3' | 'dso4';

@Component({
  selector: 'app-ml-tools',
  standalone: true,
  imports: [CommonModule, FormsModule, DropoutScatter3dComponent],
  templateUrl: './ml-tools.html',
})
export class MlTools implements OnInit {

  // ── Tab state ────────────────────────────────────────────────────────────
  activeTab: Tab = 'dso1';
  private loaded: Record<Tab, boolean> = { dso1: false, dso2: false, dso3: false, dso4: false };

  // ── Global state ─────────────────────────────────────────────────────────
  loading = false;
  building = false;
  datasetNeeded = false;
  buildError = '';
  buildSuccess = '';

  // ── DSO1 — Dropout risk ───────────────────────────────────────────────────
  dso1Summary: any = null;
  dso1Students: any[] = [];
  dso1WeeklyTrend: any = null;
  dso1Funnel: any = null;
  dso1Retention: any[] = [];
  dso1Scatter: any = null;
  dso1Correlation: any[] = [];
  dso1RiskFilter = 'all';
  dso1LevelFilter = 'all';
  dso1Search = '';

  // ── DSO2 — Grade prediction ───────────────────────────────────────────────
  dso2Students: any[] = [];
  dso2Dist: any = null;
  dso2Declining: any[] = [];
  dso2LevelFilter = 'all';
  dso2StatusFilter = 'all';
  dso2Search = '';

  // ── DSO3 — Clustering ─────────────────────────────────────────────────────
  dso3Clusters: any[] = [];
  dso3Students: any[] = [];
  dso3PcaData: any = null;
  dso3Summary: any = null;
  dso3ClusterFilter = 'all';
  dso3LevelFilter = 'all';
  dso3Search = '';

  // ── DSO4 — Payment risk ───────────────────────────────────────────────────
  dso4Summary: any = null;
  dso4Students: any[] = [];
  dso4RiskFilter = 'all';
  dso4LevelFilter = 'all';
  dso4Search = '';

  constructor(private ml: MlService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadTab('dso1');
  }

  setTab(tab: Tab): void {
    this.activeTab = tab;
    if (!this.loaded[tab]) {
      this.loadTab(tab);
    }
  }

  // ── Dataset build ────────────────────────────────────────────────────────
  buildDataset(): void {
    this.building = true;
    this.buildError = '';
    this.buildSuccess = '';
    this.ml.buildDataset().subscribe({
      next: (res) => {
        this.building = false;
        this.datasetNeeded = false;
        this.buildSuccess = `Dataset built — ${res.rows} students assembled.`;
        this.loaded = { dso1: false, dso2: false, dso3: false, dso4: false };
        this.loadTab(this.activeTab);
        setTimeout(() => { this.buildSuccess = ''; this.cdr.detectChanges(); }, 6000);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.building = false;
        this.buildError = err?.error?.detail || 'Dataset build failed. Check that all databases are reachable.';
        this.cdr.detectChanges();
      },
    });
  }

  // ── Tab loader dispatcher ─────────────────────────────────────────────────
  private loadTab(tab: Tab): void {
    this.loading = true;
    this.cdr.detectChanges();

    const handle503 = (err: any) => {
      if (err?.status === 503) { this.datasetNeeded = true; }
      return of(null);
    };

    switch (tab) {
      case 'dso1': this.loadDso1(handle503); break;
      case 'dso2': this.loadDso2(handle503); break;
      case 'dso3': this.loadDso3(handle503); break;
      case 'dso4': this.loadDso4(handle503); break;
    }
  }

  // ── DSO1 loaders ─────────────────────────────────────────────────────────
  private loadDso1(handle503: (e: any) => any): void {
    const safe = (e: any) => handle503(e);
    forkJoin({
      summary:     this.ml.dso1Summary().pipe(catchError(safe)),
      students:    this.ml.dso1Students().pipe(catchError(safe)),
      weeklyTrend: this.ml.dso1WeeklyTrend().pipe(catchError(safe)),
      funnel:      this.ml.dso1Funnel().pipe(catchError(safe)),
      retention:   this.ml.dso1RetentionByLevel().pipe(catchError(safe)),
      scatter:     this.ml.dso1Scatter().pipe(catchError(safe)),
      correlation: this.ml.dso1FeatureCorrelation().pipe(catchError(safe)),
    }).subscribe(res => {
      if (res.summary)     this.dso1Summary     = res.summary;
      if (res.students)    this.dso1Students    = res.students as any[];
      if (res.weeklyTrend) this.dso1WeeklyTrend = res.weeklyTrend;
      if (res.funnel)      this.dso1Funnel      = res.funnel;
      if (res.retention)   this.dso1Retention   = res.retention as any[];
      if (res.scatter)     this.dso1Scatter     = res.scatter;
      if (res.correlation) this.dso1Correlation = res.correlation as any[];
      this.loading = false;
      this.loaded['dso1'] = true;
      this.cdr.detectChanges();
    });
  }

  applyDso1Filters(): void {
    this.ml.dso1Students(this.dso1RiskFilter, this.dso1LevelFilter, this.dso1Search)
      .pipe(catchError(() => of([])))
      .subscribe(data => { this.dso1Students = data; this.cdr.detectChanges(); });
  }

  // ── DSO2 loaders ─────────────────────────────────────────────────────────
  private loadDso2(handle503: (e: any) => any): void {
    let done = 0;
    const finish = () => { if (++done === 3) { this.loading = false; this.loaded['dso2'] = true; this.cdr.detectChanges(); } };

    this.ml.dso2Students().pipe(catchError(e => handle503(e))).subscribe(data => {
      if (data) this.dso2Students = data as any[];
      finish();
    });

    this.ml.dso2Distribution().pipe(catchError(e => handle503(e))).subscribe(data => {
      if (data) this.dso2Dist = data;
      finish();
    });

    this.ml.dso2TopDeclining().pipe(catchError(e => handle503(e))).subscribe(data => {
      if (data) this.dso2Declining = data as any[];
      finish();
    });
  }

  applyDso2Filters(): void {
    this.ml.dso2Students(this.dso2Search, this.dso2LevelFilter, this.dso2StatusFilter)
      .pipe(catchError(() => of([])))
      .subscribe(data => {
        this.dso2Students = data;
        if (this.dso2LevelFilter !== 'all') {
          this.ml.dso2Distribution(this.dso2LevelFilter)
            .pipe(catchError(() => of(null)))
            .subscribe(d => { if (d) this.dso2Dist = d; this.cdr.detectChanges(); });
        }
        this.cdr.detectChanges();
      });
  }

  // ── DSO3 loaders ─────────────────────────────────────────────────────────
  private loadDso3(handle503: (e: any) => any): void {
    let done = 0;
    const finish = () => { if (++done === 4) { this.loading = false; this.loaded['dso3'] = true; this.cdr.detectChanges(); } };

    this.ml.dso3Clusters().pipe(catchError(e => handle503(e))).subscribe(data => {
      if (data) this.dso3Clusters = data as any[];
      finish();
    });

    this.ml.dso3Students().pipe(catchError(e => handle503(e))).subscribe(data => {
      if (data) this.dso3Students = data as any[];
      finish();
    });

    this.ml.dso3Pca().pipe(catchError(e => handle503(e))).subscribe(data => {
      if (data) this.dso3PcaData = data;
      finish();
    });

    this.ml.dso3Summary().pipe(catchError(e => handle503(e))).subscribe(data => {
      if (data) this.dso3Summary = data;
      finish();
    });
  }

  applyDso3Filters(): void {
    this.ml.dso3Students(this.dso3ClusterFilter, this.dso3LevelFilter, this.dso3Search)
      .pipe(catchError(() => of([])))
      .subscribe(data => { this.dso3Students = data; this.cdr.detectChanges(); });
  }

  // ── DSO4 loaders ─────────────────────────────────────────────────────────
  private loadDso4(handle503: (e: any) => any): void {
    let done = 0;
    const finish = () => { if (++done === 2) { this.loading = false; this.loaded['dso4'] = true; this.cdr.detectChanges(); } };

    this.ml.dso4Summary().pipe(catchError(e => handle503(e))).subscribe(data => {
      if (data) this.dso4Summary = data;
      finish();
    });

    this.ml.dso4Students().pipe(catchError(e => handle503(e))).subscribe(data => {
      if (data) this.dso4Students = data as any[];
      finish();
    });
  }

  applyDso4Filters(): void {
    this.ml.dso4Students(this.dso4RiskFilter, this.dso4LevelFilter, this.dso4Search)
      .pipe(catchError(() => of([])))
      .subscribe(data => { this.dso4Students = data; this.cdr.detectChanges(); });
  }

  exportCsv(): void {
    this.ml.dso4Export().subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'overdue_students.csv';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // ── DSO1 SVG helpers — Absence×Dropout scatter ────────────────────────────
  readonly SC_W = 520;
  readonly SC_H = 260;
  readonly SC_PAD = 32;

  private scaleScatter(pts: any[]): { minX: number; maxX: number; minY: number; maxY: number } {
    if (!pts?.length) return { minX: 0, maxX: 1, minY: 0, maxY: 1 };
    const xs = pts.map((p: any) => p.x);
    const ys = pts.map((p: any) => p.y);
    return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
  }

  scatterX(v: number): number {
    if (!this.dso1Scatter?.points?.length) return 0;
    const { minX, maxX } = this.scaleScatter(this.dso1Scatter.points);
    const range = maxX - minX || 1;
    return this.SC_PAD + ((v - minX) / range) * (this.SC_W - this.SC_PAD * 2);
  }

  scatterY(v: number): number {
    if (!this.dso1Scatter?.points?.length) return 0;
    const { minY, maxY } = this.scaleScatter(this.dso1Scatter.points);
    const range = maxY - minY || 1;
    return this.SC_PAD + ((maxY - v) / range) * (this.SC_H - this.SC_PAD * 2);
  }

  get scatterTrendLine(): { x1: number; y1: number; x2: number; y2: number } | null {
    const tl = this.dso1Scatter?.trend_line;
    if (!tl || !this.dso1Scatter?.points?.length) return null;
    return {
      x1: this.scatterX(tl.x1), y1: this.scatterY(tl.y1),
      x2: this.scatterX(tl.x2), y2: this.scatterY(tl.y2),
    };
  }

  scatterDotColor(risk: string): string {
    return ({ critical: '#991B1B', high: '#D85A30', moderate: '#BA7517', low: '#1D9E75' } as any)[risk] ?? '#888';
  }

  // ── DSO1 helpers — weekly bar chart ───────────────────────────────────────
  get weeklyBarMax(): number {
    if (!this.dso1WeeklyTrend?.dropout_rate?.length) return 1;
    return Math.max(...this.dso1WeeklyTrend.dropout_rate, 0.01);
  }

  weeklyBarH(val: number): number {
    return Math.max(4, Math.round((val / this.weeklyBarMax) * 80));
  }

  // ── DSO1 helpers — funnel ─────────────────────────────────────────────────
  get funnelMax(): number {
    const stages = this.dso1Funnel?.stages;
    if (!stages?.length) return 1;
    return Math.max(...stages.map((s: any) => s.count), 1);
  }

  funnelPct(count: number): number {
    return Math.round((count / this.funnelMax) * 100);
  }

  // ── DSO1 helpers — retention bars ─────────────────────────────────────────
  retentionColor(rate: number): string {
    if (rate >= 0.85) return '#1D9E75';
    if (rate >= 0.70) return '#BA7517';
    return '#D85A30';
  }

  // ── DSO1 helpers — correlation bars ───────────────────────────────────────
  corrBarW(r: number): number {
    return Math.round(Math.abs(r) * 100);
  }

  corrColor(r: number): string {
    return r >= 0 ? '#D85A30' : '#378ADD';
  }

  // ── DSO1 helpers — KPI sparklines ─────────────────────────────────────────
  kpiSparkH(dist: any[], val: number): number {
    if (!dist?.length) return 4;
    const mn = Math.min(...dist.map((d: any) => d.count));
    const mx = Math.max(...dist.map((d: any) => d.count));
    const rng = mx - mn || 1;
    return Math.max(4, Math.round(((val - mn) / rng) * 28) + 4);
  }

  // ── SVG helpers — PCA scatter ─────────────────────────────────────────────
  readonly SVG_W = 600;
  readonly SVG_H = 300;
  readonly SVG_PAD = 24;

  get pcaPoints(): any[] {
    if (!this.dso3PcaData?.points?.length) return [];
    const pts = this.dso3PcaData.points;
    const xs = pts.map((p: any) => p.x);
    const ys = pts.map((p: any) => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    const W = this.SVG_W - this.SVG_PAD * 2;
    const H = this.SVG_H - this.SVG_PAD * 2;
    return pts.map((p: any) => ({
      ...p,
      sx: this.SVG_PAD + ((p.x - minX) / rangeX) * W,
      sy: this.SVG_PAD + ((maxY - p.y) / rangeY) * H,
    }));
  }

  get pcaCentroids(): any[] {
    if (!this.dso3PcaData?.points?.length || !this.dso3PcaData?.centroids?.length) return [];
    const pts = this.dso3PcaData.points;
    const xs = pts.map((p: any) => p.x);
    const ys = pts.map((p: any) => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    const W = this.SVG_W - this.SVG_PAD * 2;
    const H = this.SVG_H - this.SVG_PAD * 2;
    return this.dso3PcaData.centroids.map((c: any) => ({
      ...c,
      sx: this.SVG_PAD + ((c.x - minX) / rangeX) * W,
      sy: this.SVG_PAD + ((maxY - c.y) / rangeY) * H,
    }));
  }

  clusterColor(id: number): string {
    return ['#1D9E75', '#BA7517', '#D85A30'][id] ?? '#888';
  }

  // ── SVG helpers — Donut (DSO4) ────────────────────────────────────────────
  readonly DONUT_R = 45;
  readonly DONUT_C = 2 * Math.PI * 45;

  get donutSegments(): { color: string; dash: string; offset: number }[] {
    if (!this.dso4Summary) return [];
    const total = this.dso4Summary.total_students || 1;
    const c = this.DONUT_C;
    const hi  = (this.dso4Summary.high_risk_count   / total) * c;
    const med = (this.dso4Summary.medium_risk_count / total) * c;
    const lo  = (this.dso4Summary.low_risk_count    / total) * c;
    return [
      { color: '#D85A30', dash: `${hi.toFixed(1)} ${c.toFixed(1)}`,  offset: 0 },
      { color: '#BA7517', dash: `${med.toFixed(1)} ${c.toFixed(1)}`, offset: -hi },
      { color: '#1D9E75', dash: `${lo.toFixed(1)} ${c.toFixed(1)}`,  offset: -(hi + med) },
    ];
  }

  // ── Bar helpers — aging (DSO4) ────────────────────────────────────────────
  get agingBars(): any[] {
    if (!this.dso4Summary?.aging_buckets) return [];
    const buckets = this.dso4Summary.aging_buckets;
    const maxCount = Math.max(...buckets.map((b: any) => b.count), 1);
    const colors = ['#1D9E75', '#BA7517', '#D85A30', '#991B1B'];
    return buckets.map((b: any, i: number) => ({
      ...b,
      pct: Math.round((b.count / maxCount) * 100),
      color: colors[i] ?? '#888',
    }));
  }

  // ── Bar helpers — grade distribution (DSO2) ───────────────────────────────
  get distBars(): any[] {
    if (!this.dso2Dist?.buckets) return [];
    const buckets = this.dso2Dist.buckets;
    const maxCount = Math.max(...buckets.map((b: any) => b.count), 1);
    const colors = ['#DC2626', '#EA580C', '#7C3AED', '#2563EB', '#16A34A'];
    return buckets.map((b: any, i: number) => ({
      ...b,
      pct: Math.round((b.count / maxCount) * 100),
      color: colors[i] ?? '#888',
    }));
  }

  // ── Formatting helpers ────────────────────────────────────────────────────
  riskBadgeClass(risk: string): string {
    return { critical: 'badge-critical', high: 'badge-high', moderate: 'badge-moderate', medium: 'badge-medium', low: 'badge-low' }[risk] ?? 'badge-low';
  }

  statusBadgeClass(status: string): string {
    return { improving: 'badge-improving', declining: 'badge-declining', stable: 'badge-stable' }[status] ?? 'badge-stable';
  }

  pct(val: number): string {
    return `${Math.round(val * 100)}%`;
  }

  flagLabel(f: string): string {
    return { absence: 'Absent', note: 'Failing', retard: 'Late pmt' }[f] ?? f;
  }

  flagClass(f: string): string {
    return { absence: 'flag-red', note: 'flag-red', retard: 'flag-orange' }[f] ?? '';
  }

  // Expose Math for template
  readonly Math = Math;

  getSparkHeight(trend: number[], val: number): number {
    const mn = Math.min(...trend);
    const mx = Math.max(...trend);
    const rng = mx - mn || 1;
    return Math.round(((val - mn) / rng) * 22) + 4;
  }
}
