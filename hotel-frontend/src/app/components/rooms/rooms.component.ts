import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Room } from './room.model';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss'
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];
  apiUrl = 'http://localhost:8000/api/room/getRooms.php';
  showAuthModal = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchRooms();
  }

  fetchRooms() {
    this.http.get<Room[]>(this.apiUrl).subscribe({
      next: (data: Room[]) => {
        this.rooms = data;
      },
      error: (err: any) => {
        console.error('Gabim gjatë marrjes së dhomave:', err);
      }
    });
  }

  onRoomClick() {
    if (this.authService.isLoggedIn()) {
      // Komento navigate deri sa të bësh booking faqen
      // this.router.navigate(['/booking']);
      alert('Rezervimi do të jetë i disponueshëm së shpejti!');
    } else {
      this.showAuthModal = true;
    }
  }

  goToLogin() {
    this.showAuthModal = false;
    this.router.navigate(['/login']);
  }

  goToSignup() {
    this.showAuthModal = false;
    this.router.navigate(['/login'], { queryParams: { mode: 'signup' } });
  }

  closeModal() {
    this.showAuthModal = false;
  }
}
