import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const ML = 'http://localhost:8100/ml';

@Injectable({ providedIn: 'root' })
export class MlService {
  constructor(private http: HttpClient) {}

  buildDataset(): Observable<any> {
    return this.http.post(`${ML}/dataset/build`, {});
  }

  datasetStatus(): Observable<any> {
    return this.http.get(`${ML}/dataset/status`);
  }

  // ── DSO1 ──────────────────────────────────────────────────────────────────
  dso1Summary(): Observable<any> {
    return this.http.get(`${ML}/dso1/summary`);
  }

  dso1Students(riskLevel = 'all', level = 'all', search = ''): Observable<any[]> {
    return this.http.get<any[]>(`${ML}/dso1/students`, {
      params: { risk_level: riskLevel, level, search },
    });
  }

  dso1WeeklyTrend(weeks = 8): Observable<any> {
    return this.http.get(`${ML}/dso1/weekly-trend`, { params: { weeks } });
  }

  dso1Funnel(): Observable<any> {
    return this.http.get(`${ML}/dso1/funnel`);
  }

  dso1RetentionByLevel(): Observable<any[]> {
    return this.http.get<any[]>(`${ML}/dso1/retention-by-level`);
  }

  dso1Scatter(maxPoints = 150): Observable<any> {
    return this.http.get(`${ML}/dso1/scatter`, { params: { max_points: maxPoints } });
  }

  dso1FeatureCorrelation(): Observable<any[]> {
    return this.http.get<any[]>(`${ML}/dso1/feature-correlation`);
  }

  // ── DSO2 ──────────────────────────────────────────────────────────────────
  dso2Students(search = '', level = 'all', status = 'all'): Observable<any[]> {
    return this.http.get<any[]>(`${ML}/dso2/students`, {
      params: { search, level, status },
    });
  }

  dso2Distribution(level = 'all'): Observable<any> {
    return this.http.get(`${ML}/dso2/distribution`, { params: { level } });
  }

  dso2TopDeclining(): Observable<any[]> {
    return this.http.get<any[]>(`${ML}/dso2/top-declining`);
  }

  // ── DSO3 ──────────────────────────────────────────────────────────────────
  dso3Clusters(): Observable<any[]> {
    return this.http.get<any[]>(`${ML}/dso3/clusters`);
  }

  dso3Students(cluster = 'all', level = 'all', search = ''): Observable<any[]> {
    return this.http.get<any[]>(`${ML}/dso3/students`, {
      params: { cluster, level, search },
    });
  }

  dso3Pca(): Observable<any> {
    return this.http.get(`${ML}/dso3/pca`);
  }

  dso3Summary(): Observable<any> {
    return this.http.get(`${ML}/dso3/summary`);
  }

  // ── DSO4 ──────────────────────────────────────────────────────────────────
  dso4Summary(): Observable<any> {
    return this.http.get(`${ML}/dso4/summary`);
  }

  dso4Students(riskLevel = 'all', level = 'all', search = ''): Observable<any[]> {
    return this.http.get<any[]>(`${ML}/dso4/students`, {
      params: { risk_level: riskLevel, level, search },
    });
  }

  dso4Export(): Observable<Blob> {
    return this.http.get(`${ML}/dso4/export`, { responseType: 'blob' });
  }
}
