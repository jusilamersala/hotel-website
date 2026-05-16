import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive,Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // ← SHTO

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userName = '';
  userInitials = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Kontrollon localStorage kur navbar ngarkohet
    const user = this.authService.getUser();
    if (user) {
      this.isLoggedIn = true;
      this.userName = user.name;
      // Gjeneron iniciale: "Arta Hoxha" → "AH"
      this.userInitials = user.name?.charAt(0).toUpperCase();
    }
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userName = '';
    this.userInitials = '';
    this.router.navigate(['/home']);
  }

  closeMenu(toggler: HTMLButtonElement) {
    const isMobile = window.getComputedStyle(toggler).display !== 'none';
    const menu = document.getElementById('hotelNav');
    const isOpen = menu?.classList.contains('show');
    if (isMobile && isOpen) {
      toggler.click();
    }
  }
}
