import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_RESOURCES } from '../core/mock/mock-data';

export interface LearningResource {
  id?: number;
  title: string;
  type: string;
  published?: boolean;
  fileUrl?: string;
  assessmentId: number;
  uploadedAt?: string;
  size?: string;
}

let _resources: LearningResource[] = [...MOCK_RESOURCES];

@Injectable({ providedIn: 'root' })
export class ResourcesService {

  getByAssessment(assessmentId: number): Observable<LearningResource[]> {
    return of(_resources.filter(r => r.assessmentId === assessmentId)).pipe(delay(200));
  }

  getAll(): Observable<LearningResource[]> {
    return of([..._resources]).pipe(delay(200));
  }

  upload(_formData: FormData): Observable<LearningResource> {
    const created: LearningResource = {
      id: Math.max(0, ..._resources.map(r => r.id ?? 0)) + 1,
      title: 'Uploaded Resource',
      type: 'PDF',
      published: true,
      assessmentId: 0,
      uploadedAt: new Date().toISOString(),
      size: '1.0 MB',
    };
    _resources = [..._resources, created];
    return of(created).pipe(delay(600));
  }

  delete(id: number): Observable<{ status: number }> {
    _resources = _resources.filter(r => r.id !== id);
    return of({ status: 204 }).pipe(delay(300));
  }
}
