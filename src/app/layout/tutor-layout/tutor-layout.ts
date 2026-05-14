import { Component, OnInit, inject, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { MOCK_ASSESSMENTS, MOCK_PLANNING, MOCK_CLASSES } from '../../core/mock/mock-data';

const TUTOR_ID = '2';

interface Notification { icon: string; text: string; time: string; unread: boolean; }
interface Message { from: string; preview: string; time: string; unread: boolean; avatar: string; }

@Component({
  selector: 'app-tutor-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, CommonModule, FormsModule],
  templateUrl: './tutor-layout.html',
  styleUrls: ['./tutor-layout.css']
})
export class TutorLayout implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  userName = 'Tutor';
  userEmail = '';
  sidebarOpen = false;
  userMenuOpen = false;
  notifOpen = false;
  messagesOpen = false;
  aiAssistantOpen = false;

  notifications: Notification[] = [];
  messages: Message[] = [];
  aiQuery = '';
  aiResponse = '';

  get unreadCount(): number { return this.notifications.filter(n => n.unread).length; }
  get unreadMessages(): number { return this.messages.filter(m => m.unread).length; }

  private relativeTime(dateStr: string): string {
    const diff = new Date(dateStr).getTime() - Date.now();
    const absDiff = Math.abs(diff);
    const days = Math.floor(absDiff / 86400000);
    const hours = Math.floor(absDiff / 3600000);
    if (diff < 0) return days > 0 ? `${days}d ago` : `${hours}h ago`;
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days}d`;
  }

  ngOnInit(): void {
    this.userName  = this.auth.getFullName();
    this.userEmail = this.auth.getEmail() ?? '';

    const myClassNames = MOCK_CLASSES.filter(c => c.tutorId === TUTOR_ID).map(c => c.name);

    const draftNotifs = MOCK_ASSESSMENTS
      .filter(a => a.status === 'DRAFT' && myClassNames.includes(a.className ?? ''))
      .map(a => ({ icon: 'edit_note', text: `Draft pending: ${a.title}`, time: 'Action needed', unread: true }));

    const upcomingNotifs = MOCK_PLANNING
      .filter(p => {
        const classes = p.className.split(',').map((s: string) => s.trim());
        return new Date(p.startDate) >= new Date()
          && (classes.includes('ALL') || classes.some((c: string) => myClassNames.includes(c)));
      })
      .slice(0, 3)
      .map(p => ({ icon: 'event', text: p.title, time: this.relativeTime(p.startDate), unread: false }));

    this.notifications = [...draftNotifs, ...upcomingNotifs].slice(0, 6);

    this.messages = [
      { from: 'Fatma Mansouri', preview: 'Bonjour, je voulais savoir comment se passe le cours pour Karim...', time: '2h ago', unread: true, avatar: 'F' },
      { from: 'Riadh Trabelsi', preview: 'Est-ce que Youssef peut rattraper le cours de demain?', time: '1d ago', unread: true, avatar: 'R' },
      { from: 'Hind Chebbi', preview: 'Merci pour les retards sur les devoirs d\'Amira.', time: '2d ago', unread: false, avatar: 'H' },
      { from: 'Admin Ahmed', preview: 'Réunion pédagogique ce vendredi à 14h.', time: '3d ago', unread: false, avatar: 'A' },
    ];
  }

  askAI(): void {
    if (!this.aiQuery.trim()) return;
    const q = this.aiQuery.toLowerCase();
    if (q.includes('risk') || q.includes('at-risk')) {
      this.aiResponse = 'Based on current data, 2 students in your classes need attention: Malek Oueslati (TWIN1, critical risk) and Youssef Trabelsi (TWIN2, high risk). Consider scheduling parent meetings.';
    } else if (q.includes('grade') || q.includes('average')) {
      this.aiResponse = 'Your class average is 76.4%. TWIN1 averages 78.3% and TWIN2 averages 74.5%. Amira Chebbi has the highest performance at 92%.';
    } else if (q.includes('attendance')) {
      this.aiResponse = 'Overall attendance rate is 85%. TWIN1: 88%, TWIN2: 82%. Malek Oueslati has the lowest attendance at 58%.';
    } else if (q.includes('lesson') || q.includes('recommend')) {
      this.aiResponse = 'I recommend focusing on conversational exercises for TWIN1 this week. For TWIN2, grammar review would be beneficial based on recent quiz scores.';
    } else {
      this.aiResponse = `I've analyzed your teaching data. Here's a tip: Students with higher engagement show 34% better results. Consider adding interactive elements to your next lesson plan.`;
    }
    setTimeout(() => {
      const el = document.querySelector('.ai-response');
      el?.classList.add('visible');
    }, 100);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/signin']);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    const t = e.target as HTMLElement;
    if (!t.closest('.user-menu-wrap')) this.userMenuOpen = false;
    if (!t.closest('.notif-wrap'))     this.notifOpen    = false;
    if (!t.closest('.msgs-wrap'))      this.messagesOpen = false;
    if (!t.closest('.sidebar') && !t.closest('.hamburger')) this.sidebarOpen = false;
    if (!t.closest('.ai-wrap'))        this.aiAssistantOpen = false;
  }
}
