// Auth service — fully offline mock, no backend required
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, throwError, delay } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import {
  MOCK_CREDENTIALS,
  ACCEPTED_PASSWORDS,
} from '../mock/mock-data';

interface JwtPayload {
  sub: string;
  userId?: string;
  email?: string;
  role: string;
  status?: string;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  firstName?: string;
  lastName?: string;
  iat: number;
  exp: number;
}

export interface AuthFlowResponse {
  token?: string;
  accessToken?: string | null;
  requiresTwoFactor?: boolean;
  twoFactorRequired?: boolean;
  emailVerified?: boolean;
  accountStatus?: string | null;
  userId?: string;
  role?: string;
  maskedEmail?: string | null;
}

// Build a proper JWT (Base64URL encoded, parseable by jwtDecode)
function buildFakeJwt(payload: Record<string, unknown>): string {
  const b64 = (obj: unknown) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  const header  = b64({ alg: 'HS256', typ: 'JWT' });
  const body    = b64(payload);
  const sig     = b64('demo_signature_not_verified');
  return `${header}.${body}.${sig}`;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private platformId = inject(PLATFORM_ID);

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(email: string, password: string): Observable<AuthFlowResponse> {
    const user = MOCK_CREDENTIALS[email.toLowerCase().trim()];

    if (!user || !ACCEPTED_PASSWORDS.has(password)) {
      return throwError(() => ({ error: { message: 'Invalid credentials. Use demo123 as password.' } })).pipe(delay(400));
    }

    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24h
    const token = buildFakeJwt({
      sub: email,
      userId: user.id,
      email,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      firstName: user.firstName,
      lastName: user.lastName,
      iat: Math.floor(Date.now() / 1000),
      exp,
    });

    if (this.isBrowser()) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }

    const response: AuthFlowResponse = {
      token,
      twoFactorRequired: false,
      emailVerified: user.emailVerified,
      accountStatus: user.status,
      userId: user.id,
      role: user.role,
    };
    return of(response).pipe(delay(500));
  }

  verifyTwoFactor(_email: string, _code: string): Observable<AuthFlowResponse> {
    return of({ token: this.getToken() ?? undefined }).pipe(delay(300));
  }

  sendEmailVerification(_email: string): Observable<void> {
    return of(undefined).pipe(delay(300));
  }

  requestPasswordReset(_email: string): Observable<void> {
    return of(undefined).pipe(delay(400));
  }

  confirmPasswordReset(_token: string, _newPassword: string): Observable<void> {
    return of(undefined).pipe(delay(400));
  }

  register(data: { email: string; password: string; firstName?: string; lastName?: string; role?: string; [key: string]: unknown }): Observable<unknown> {
    const existing = MOCK_CREDENTIALS[data.email?.toLowerCase()?.trim() ?? ''];
    if (existing) {
      return throwError(() => ({ error: { message: 'Email already registered. Try signing in.' } })).pipe(delay(400));
    }
    return of({ message: 'Registration successful. Sign in with your credentials.' }).pipe(delay(600));
  }

  enableTwoFactor(): Observable<void>  { return of(undefined).pipe(delay(300)); }
  disableTwoFactor(): Observable<void> { return of(undefined).pipe(delay(300)); }

  logout(): void {
    if (this.isBrowser()) localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      this.logout();
      return false;
    }
  }

  private decoded(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try { return jwtDecode<JwtPayload>(token); } catch { return null; }
  }

  getRole(): string | null  { return this.decoded()?.role ?? null; }
  getStatus(): string | null { return this.decoded()?.status ?? null; }
  isEmailVerified(): boolean { return !!this.decoded()?.emailVerified; }
  hasRole(...roles: string[]): boolean { const r = this.getRole(); return r !== null && roles.includes(r); }
  getUserId(): string | null { const d = this.decoded(); return d?.userId ?? d?.sub ?? null; }
  getEmail(): string | null  { const d = this.decoded(); return d?.email ?? d?.sub ?? null; }
  getFirstName(): string | null { return (this.decoded() as any)?.firstName ?? null; }
  getLastName(): string | null  { return (this.decoded() as any)?.lastName ?? null; }
  getFullName(): string {
    const f = this.getFirstName(); const l = this.getLastName();
    return [f, l].filter(Boolean).join(' ') || this.getEmail() || 'User';
  }
}
