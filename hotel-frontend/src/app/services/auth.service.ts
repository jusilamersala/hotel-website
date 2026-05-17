import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Injekton PLATFORM_ID për të kuptuar nëse jemi në browser apo server
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser()) return false; // ← nëse server, kthe false
    return !!localStorage.getItem('user');
  }

  getUser(): any {
    if (!this.isBrowser()) return null; // ← nëse server, kthe null
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    if (!this.isBrowser()) return; // ← nëse server, mos bëj asgjë
    localStorage.removeItem('user');
  }
}
