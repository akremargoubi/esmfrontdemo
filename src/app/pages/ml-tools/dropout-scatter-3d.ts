import {
  Component, Input, OnChanges, AfterViewInit, ViewChild,
  ElementRef, OnDestroy, PLATFORM_ID, Inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-dropout-scatter-3d',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropout-scatter-3d.html',
  styles: [':host { display: block; }'],
})
export class DropoutScatter3dComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() students: any[] = [];
  @Input() loading = false;

  @ViewChild('plotContainer') plotContainer!: ElementRef<HTMLDivElement>;

  private Plotly: any;
  private rafId: number | null = null;
  private angle = 0;
  private rotating = false;
  private viewReady = false;
  private inactivityTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.isBrowser && this.students.length && !this.loading) {
      this.render();
    }
  }

  ngOnChanges(): void {
    if (!this.isBrowser || !this.viewReady) return;
    if (this.students.length && !this.loading) {
      this.render();
    } else {
      this.stopRotation();
    }
  }

  ngOnDestroy(): void {
    this.stopRotation();
    if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
    if (this.Plotly && this.plotContainer?.nativeElement) {
      try { this.Plotly.purge(this.plotContainer.nativeElement); } catch {}
    }
  }

  onInteraction(): void {
    this.stopRotation();
    if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => {
      if (this.viewReady && this.students.length) this.startRotation();
    }, 2000);
  }

  get hasData(): boolean { return !this.loading && this.students.length > 0; }

  private async render(): Promise<void> {
    if (!this.plotContainer?.nativeElement) return;

    if (!this.Plotly) {
      const mod = await import('plotly.js-dist-min');
      this.Plotly = (mod as any).default ?? mod;
    }

    const el = this.plotContainer.nativeElement;
    this.stopRotation();

    const x = this.students.map((s: any) => +(s.absence_rate ?? 0));
    const y = this.students.map((s: any) => +(s.note_moyenne ?? 0));
    const z = this.students.map((s: any) => +(s.dropout_prob ?? 0));
    const markerSizes = z.map((v: number) => 4 + Math.round(v * 8));
    const hoverText = this.students.map((s: any) =>
      `<b>${s.name}</b><br>` +
      `Absence: ${((s.absence_rate ?? 0) * 100).toFixed(0)}%<br>` +
      `Grade: ${s.note_moyenne?.toFixed(1) ?? '—'}<br>` +
      `Dropout P: ${((s.dropout_prob ?? 0) * 100).toFixed(0)}%<br>` +
      `Risk: ${s.risk_level ?? '—'}`
    );

    // 20×20 grid for probability surface  P = sigmoid(-3.5 + 7.2·a - 0.28·g)
    const sigmoid = (v: number) => 1 / (1 + Math.exp(-v));
    const absGrid  = Array.from({ length: 20 }, (_, i) => i / 19);
    const gradeGrid = Array.from({ length: 20 }, (_, i) => (i / 19) * 20);
    const surfZ = gradeGrid.map(g => absGrid.map(a => sigmoid(-3.5 + 7.2 * a - 0.28 * g)));
    const boundZ = gradeGrid.map(() => absGrid.map(() => 0.5));

    const colorscale = [
      [0,    '#1D9E75'],
      [0.35, '#BA7517'],
      [0.60, '#D85A30'],
      [1,    '#991B1B'],
    ];

    const scatterTrace: any = {
      type: 'scatter3d',
      mode: 'markers',
      x, y, z,
      text: hoverText,
      hoverinfo: 'text',
      marker: {
        size: markerSizes,
        color: z,
        colorscale,
        cmin: 0,
        cmax: 1,
        colorbar: {
          title: 'Dropout P',
          titleside: 'right',
          thickness: 12,
          len: 0.65,
          tickformat: '.0%',
          tickfont: { size: 10, color: '#64748b' },
          titlefont: { size: 10, color: '#64748b' },
        },
        opacity: 0.88,
        line: { width: 0 },
      },
    };

    const surfTrace: any = {
      type: 'surface',
      x: absGrid,
      y: gradeGrid,
      z: surfZ,
      colorscale,
      cmin: 0,
      cmax: 1,
      opacity: 0.15,
      showscale: false,
      hoverinfo: 'skip',
      contours: {
        x: { highlight: false },
        y: { highlight: false },
        z: { highlight: false },
      },
    };

    const boundTrace: any = {
      type: 'surface',
      x: absGrid,
      y: gradeGrid,
      z: boundZ,
      colorscale: [[0, '#3b82f6'], [1, '#3b82f6']],
      opacity: 0.08,
      showscale: false,
      hoverinfo: 'skip',
      contours: {
        x: { highlight: false },
        y: { highlight: false },
        z: { highlight: false },
      },
    };

    const layout: any = {
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      scene: {
        bgcolor: 'rgba(248,250,252,0.5)',
        xaxis: {
          title: 'Absence Rate',
          tickformat: '.0%',
          range: [0, 1],
          gridcolor: '#e2e8f0',
          zerolinecolor: '#cbd5e1',
          titlefont: { size: 11, color: '#64748b' },
          tickfont: { size: 9, color: '#94a3b8' },
        },
        yaxis: {
          title: 'Avg Grade (0–20)',
          range: [0, 20],
          gridcolor: '#e2e8f0',
          zerolinecolor: '#cbd5e1',
          titlefont: { size: 11, color: '#64748b' },
          tickfont: { size: 9, color: '#94a3b8' },
        },
        zaxis: {
          title: 'Dropout Probability',
          range: [0, 1],
          tickformat: '.0%',
          gridcolor: '#e2e8f0',
          zerolinecolor: '#cbd5e1',
          titlefont: { size: 11, color: '#64748b' },
          tickfont: { size: 9, color: '#94a3b8' },
        },
        camera: { eye: { x: 1.8, y: 1.2, z: 0.7 } },
        aspectmode: 'cube',
      },
      margin: { l: 0, r: 60, t: 10, b: 0 },
      font: { family: 'Inter, system-ui, sans-serif', size: 11 },
    };

    await this.Plotly.react(el, [surfTrace, boundTrace, scatterTrace], layout, {
      responsive: true,
      displayModeBar: false,
    });

    this.angle = 0;
    this.startRotation();
  }

  private startRotation(): void {
    this.rotating = true;
    const step = () => {
      if (!this.rotating) return;
      this.angle += 0.007;
      if (this.Plotly && this.plotContainer?.nativeElement) {
        try {
          this.Plotly.relayout(this.plotContainer.nativeElement, {
            'scene.camera.eye': {
              x: 2 * Math.cos(this.angle),
              y: 2 * Math.sin(this.angle),
              z: 0.7,
            },
          });
        } catch {}
      }
      if (this.rotating) this.rafId = requestAnimationFrame(step);
    };
    this.rafId = requestAnimationFrame(step);
  }

  private stopRotation(): void {
    this.rotating = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}
