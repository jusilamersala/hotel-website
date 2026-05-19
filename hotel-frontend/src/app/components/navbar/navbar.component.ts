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
    // 1. Dëgjojmë për çdo ndryshim të përdoruesit në kohë reale (pa pasur nevojë për refresh)
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        this.userName = user.name;
        // Gjeneron iniciale: "Arta" → "A"
        this.userInitials = user.name?.charAt(0).toUpperCase();
      } else {
        // Nëse user është null (p.sh. pas logout ose kur nuk është loguar ende)
        this.isLoggedIn = false;
        this.userName = '';
        this.userInitials = '';
      }
    });

    this.loadSpaServices();
  }

  logout() {
    // 2. Thërrasim logout nga shërbimi, i cili automatikisht do të njoftojë subscribe-in më lart
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  openProfile(toggler: HTMLButtonElement, event?: Event) {
    // Prevent any default anchor/button behavior that could cause navigation
    event?.preventDefault();

    // Close mobile menu if open
    try {
      this.closeMenu(toggler);
    } catch (e) {
      // ignore
    }

    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    // Special-case specific email
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
