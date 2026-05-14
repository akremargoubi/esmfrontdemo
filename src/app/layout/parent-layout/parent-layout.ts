import { Component, OnInit, inject, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-parent-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, CommonModule],
  templateUrl: './parent-layout.html',
  styleUrls: ['./parent-layout.css']
})
export class ParentLayout implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  userName = 'Parent';
  userEmail = '';
  sidebarOpen = false;
  userMenuOpen = false;

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
    if (!t.closest('.user-menu-wrap')) this.userMenuOpen = false;
    if (!t.closest('.sidebar') && !t.closest('.hamburger')) this.sidebarOpen = false;
  }
}
