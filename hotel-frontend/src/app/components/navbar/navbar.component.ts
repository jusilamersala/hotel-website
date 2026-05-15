import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  closeMenu(toggler: HTMLButtonElement) {
    // Kontrollon nëse butoni hamburger është i dukshëm (në mobile)
    const isMobile = window.getComputedStyle(toggler).display !== 'none';
    
    // Kontrollon nëse menuja është aktualisht e hapur (ka klasën 'show')
    const menu = document.getElementById('hotelNav');
    const isOpen = menu?.classList.contains('show');

    if (isMobile && isOpen) {
      toggler.click();
    }
  }
}