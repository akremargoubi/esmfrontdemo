// User service — mock implementation
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_USERS, MOCK_CREDENTIALS, MOCK_PARENT_CHILDREN } from '../mock/mock-data';
import { AuthService } from './auth.service';

export interface UserResponseDto {
  id: string; uuid?: string; cin?: string | null; email: string; role: string;
  firstName: string | null; lastName: string | null; avatarUrl?: string | null;
  phoneNumber?: string | null; address?: string | null; status: string | null;
  emailVerified: boolean; twoFactorEnabled?: boolean; createdAt?: string;
  updatedAt?: string; lastLoginAt?: string | null; deletedAt?: string | null;
  walletBalance?: number; parentEmail?: string | null; className?: string | null;
}

export interface PageResponse<T> {
  content: T[]; totalElements: number; totalPages: number; size: number; number: number;
}

export interface UserCreateRequest {
  email: string; password: string; cin?: string; role?: string;
  firstName?: string; lastName?: string; phoneNumber?: string; address?: string; status?: string;
}
export interface UserUpdateRequest { cin?: string; email?: string; firstName?: string; lastName?: string; phoneNumber?: string; address?: string; status?: string; role?: string; }
export interface UserSelfUpdateRequest { cin?: string; email?: string; firstName?: string; lastName?: string; phoneNumber?: string; address?: string; }

let _users = [...MOCK_USERS];

function toDto(u: any): UserResponseDto {
  return {
    id: String(u.id), email: u.email, role: u.role,
    firstName: u.firstName ?? null, lastName: u.lastName ?? null,
    status: u.status ?? 'ACTIVE', emailVerified: true,
    phoneNumber: u.phone ?? null, walletBalance: u.walletBalance ?? 0,
    createdAt: u.joinedAt ?? new Date().toISOString(),
    className: u.className ?? null,
  };
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private auth = inject(AuthService);

  listUsers(page: number, size: number, filters: { email?: string; role?: string; firstName?: string; lastName?: string; [key: string]: unknown }): Observable<PageResponse<UserResponseDto>> {
    let data = [..._users];
    if (filters.email) data = data.filter(u => u.email.toLowerCase().includes((filters.email as string).toLowerCase()));
    if (filters.role) data = data.filter(u => u.role === filters.role);
    if (filters.firstName) data = data.filter(u => u.firstName?.toLowerCase().includes((filters.firstName as string).toLowerCase()));
    if (filters.lastName) data = data.filter(u => u.lastName?.toLowerCase().includes((filters.lastName as string).toLowerCase()));
    const total = data.length;
    const content = data.slice(page * size, page * size + size).map(toDto);
    return of({ content, totalElements: total, totalPages: Math.ceil(total / size), size, number: page }).pipe(delay(300));
  }

  createUser(body: UserCreateRequest): Observable<UserResponseDto> {
    const u = { id: String(Date.now()), ...body, status: body.status ?? 'ACTIVE', joinedAt: new Date().toISOString() };
    _users = [..._users, u as any];
    return of(toDto(u)).pipe(delay(500));
  }

  updateUser(id: string, body: UserUpdateRequest): Observable<UserResponseDto> {
    _users = _users.map(u => String(u.id) === id ? { ...u, ...body } : u);
    const updated = _users.find(u => String(u.id) === id)!;
    return of(toDto(updated)).pipe(delay(400));
  }

  deleteUser(id: string): Observable<void> {
    _users = _users.filter(u => String(u.id) !== id);
    return of(undefined).pipe(delay(400));
  }

  getCurrentUser(): Observable<UserResponseDto> {
    const email = this.auth.getEmail();
    const cred = email ? MOCK_CREDENTIALS[email] : null;
    if (!cred) return of({ id: '0', email: email ?? 'user@demo.com', role: 'ADMIN', firstName: 'Admin', lastName: 'User', status: 'ACTIVE', emailVerified: true }).pipe(delay(200));
    const found = _users.find(u => String(u.id) === cred.id) ?? { id: cred.id, email, ...cred };
    return of(toDto(found)).pipe(delay(200));
  }

  updateCurrentUser(body: UserSelfUpdateRequest): Observable<UserResponseDto> {
    const email = this.auth.getEmail();
    _users = _users.map(u => u.email === email ? { ...u, ...body } : u);
    return this.getCurrentUser();
  }

  uploadAvatar(_file: File): Observable<UserResponseDto> {
    return this.getCurrentUser();
  }

  getUserById(id: string): Observable<UserResponseDto> {
    const u = _users.find(x => String(x.id) === id);
    return of(u ? toDto(u) : toDto(_users[0])).pipe(delay(200));
  }

  findByEmail(email: string): Observable<PageResponse<UserResponseDto>> {
    const found = _users.filter(u => u.email.toLowerCase().includes(email.toLowerCase())).map(toDto);
    return of({ content: found, totalElements: found.length, totalPages: 1, size: found.length, number: 0 }).pipe(delay(200));
  }

  getWallet(id: string): Observable<{ userId: string; walletBalance: number }> {
    const u = _users.find(x => String(x.id) === id);
    return of({ userId: id, walletBalance: (u as any)?.walletBalance ?? 0 }).pipe(delay(200));
  }

  topupWallet(id: string, amount: number): Observable<UserResponseDto> {
    _users = _users.map(u => String(u.id) === id ? { ...u, walletBalance: ((u as any).walletBalance ?? 0) + amount } : u);
    return this.getUserById(id);
  }

  deductWallet(id: string, amount: number): Observable<UserResponseDto> {
    _users = _users.map(u => String(u.id) === id ? { ...u, walletBalance: Math.max(0, ((u as any).walletBalance ?? 0) - amount) } : u);
    return this.getUserById(id);
  }

  setParentEmail(id: string, parentEmail: string): Observable<UserResponseDto> {
    _users = _users.map(u => String(u.id) === id ? { ...u, parentEmail } : u);
    return this.getUserById(id);
  }

  getChildrenByParent(parentId: string): Observable<UserResponseDto[]> {
    const children = MOCK_PARENT_CHILDREN[parentId] ?? [];
    return of(children.map(toDto)).pipe(delay(250));
  }
}
