import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
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
        this.performSearch(
          params['checkin'],
          params['checkout'],
          params['capacity'],
        );
      } else {
        this.fetchRooms();
      }
    });
  }

  fetchRooms() {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res: any) => {
        if (res && res.status === 'success') {
          this.rooms = res.data;
          console.log('Dhomat publike u ngarkuan me sukses!');
        } else {
          this.rooms = [];
        }
      },
      error: (err: any) => {
        console.error('Gabim gjatë marrjes së dhomave:', err);
        this.rooms = [];
      },
    });
  }

  performSearch(checkin: string, checkout: string, capacity: number) {
    const url = `${this.searchRoomsUrl}?checkin=${checkin}&checkout=${checkout}&capacity=${capacity}`;

    // U ndryshua në <any> edhe këtu për të qenë të sigurt me formatin e kërkimit
    this.http.get<any>(url).subscribe({
      next: (res: any) => {
        if (res && res.status === 'success') {
          this.rooms = res.data; // Kapa dhomat e gjetura nga kërkimi
        } else if (Array.isArray(res)) {
          // Në rast se skedari searchRoom.php kthen akoma formatin e vjetër direkt []
          this.rooms = res;
        } else {
          this.rooms = [];
        }
      },
      error: (err) => {
        console.error('Gabim gjatë kërkimit:', err);
        this.rooms = [];
      },
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
