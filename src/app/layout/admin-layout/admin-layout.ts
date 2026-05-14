import { Component, OnInit, inject, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { MOCK_ACTIVITY } from '../../core/mock/mock-data';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, CommonModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  userName = 'Admin';
  userEmail = '';
  sidebarOpen = false;
  userMenuOpen = false;
  notifOpen = false;

  notifications = MOCK_ACTIVITY.slice(0, 6).map((a, i) => ({
    icon: a.icon,
    text: a.message,
    time: this.relativeTime(a.time),
    unread: i < 3,
  }));
  get unreadCount(): number { return this.notifications.filter(n => n.unread).length; }

  private relativeTime(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  ngOnInit(): void {
    this.userName  = this.auth.getFullName();
    this.userEmail = this.auth.getEmail() ?? '';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/signin']);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    const t = e.target as HTMLElement;
    if (!t.closest('.user-menu-wrap'))  this.userMenuOpen = false;
    if (!t.closest('.notif-wrap'))      this.notifOpen    = false;
    if (!t.closest('.sidebar') && !t.closest('.hamburger')) this.sidebarOpen = false;
  }
}
