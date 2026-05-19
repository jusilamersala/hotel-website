import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);

  public currentUser$: Observable<any> = this.currentUserSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (this.isBrowser()) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        this.currentUserSubject.next(JSON.parse(savedUser));
      }
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    return !!localStorage.getItem('user');
  }

  getUser(): any {
    if (!this.isBrowser()) return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  setUser(user: any): void {
    if (!this.isBrowser()) return;
    localStorage.setItem('user', JSON.stringify(user));

    this.currentUserSubject.next(user);
  }

  logout(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem('user');

    this.currentUserSubject.next(null);
  }
}
