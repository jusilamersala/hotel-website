import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  showAuthModal = false;

  onClickSeeRooms() {
    this.router.navigate(['/rooms']);
  }

  onClickReserve(){
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/rooms']);
    } else {
      this.showAuthModal = true;
    }
  }

  closeModal() {
    this.showAuthModal = false;
  }
  goToLogin() {
    this.showAuthModal = false;
    this.router.navigate(['/login']);
  }

  goToSignup() {
    this.showAuthModal = false;
    this.router.navigate(['/login'], { queryParams: { mode: 'signup' } });
  }

}
