import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ServicesService } from '../../services/services.service';

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
  spaServices: any[] = [];

  constructor(
    private authService: AuthService,
    private servicesService: ServicesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        this.userName = user.name;
        this.userInitials = user.name?.charAt(0).toUpperCase();
      } else {
        this.isLoggedIn = false;
        this.userName = '';
        this.userInitials = '';
      }
    });

    this.loadSpaServices();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  openProfile(toggler: HTMLButtonElement, event?: Event) {
    event?.preventDefault();

    try {
      this.closeMenu(toggler);
    } catch (e) {
    }

    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    if (user.email === 'mersalajusila@gmail.com') {
      this.router.navigate(['/receptionist']);
      return;
    }

    // Role-based routing
    if (user.role === 'Admin') {
      this.router.navigate(['/admin']);
    } else if (user.role === 'Receptionist') {
      this.router.navigate(['/receptionist']);
    } else {
      this.router.navigate(['/user-dashboard']);
    }
  }

  closeMenu(toggler: HTMLButtonElement) {
    const isMobile = window.getComputedStyle(toggler).display !== 'none';
    const menu = document.getElementById('hotelNav');
    const isOpen = menu?.classList.contains('show');
    if (isMobile && isOpen) {
      toggler.click();
    }
  }

  loadSpaServices() {
    this.servicesService.getServices().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.spaServices = response.data;
        }
      },
      error: (err) => {
        console.error('Gabim gjatë ngarkimit të shërbimeve:', err);
      }
    });
  }
}
