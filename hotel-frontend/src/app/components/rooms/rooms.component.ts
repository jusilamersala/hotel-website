import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'; // Shto ActivatedRoute
import { AuthService } from '../../services/auth.service';
import { Room } from './room.model';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss',
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];
  apiUrl = 'http://localhost:8000/api/room/getRooms.php';
  searchRoomsUrl = 'http://localhost:8000/api/room/searchRoom.php';
  showAuthModal = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['checkin'] && params['checkout']) {
        // Nëse ka parametra kërkimi, thërrasim API-n e search
        this.performSearch(
          params['checkin'],
          params['checkout'],
          params['capacity'],
        );
      } else {
        // Përndryshe ngarkojmë të gjitha dhomat
        this.fetchRooms();
      }
    });
  }

  fetchRooms() {
    this.http.get<Room[]>(this.apiUrl).subscribe({
      next: (data: Room[]) => {
        this.rooms = data;
      },
      error: (err: any) => {
        console.error('Gabim gjatë marrjes së dhomave:', err);
      },
    });
  }
  performSearch(checkin: string, checkout: string, capacity: number) {
    const url = `${this.searchRoomsUrl}?checkin=${checkin}&checkout=${checkout}&capacity=${capacity}`;
    this.http.get<Room[]>(url).subscribe({
      next: (data) => {
        this.rooms = data;
      },
      error: (err) => console.error('Gabim gjatë kërkimit:', err),
    });
  }
  // Funksioni që rregullon ndryshimin e kategorive nga butonat e HTML-së
  onRoomClick(room: any) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/reservation', room.room_ID]);
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
