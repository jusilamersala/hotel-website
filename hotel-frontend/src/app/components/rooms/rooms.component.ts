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
  
  // Variablat e reja për menaxhimin e filtrimit në HTML
  filteredRooms: Room[] = [];
  selectedCategory: string = 'all';

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
        // Në fillim, dhomat e filtruara janë të barabarta me të gjitha dhomat e ardhura nga API
        this.filteredRooms = data;
        // Ruajmë gjendjen e filtrit nëse ka qenë përzgjedhur diçka
        this.setFilter(this.selectedCategory);
      },
      error: (err: any) => {
        console.error('Gabim gjatë marrjes së dhomave:', err);
      }
    });
  }

  // Funksioni që rregullon ndryshimin e kategorive nga butonat e HTML-së
  setFilter(category: string): void {
    this.selectedCategory = category;
    
    if (category === 'all') {
      this.filteredRooms = this.rooms;
    } else {
      // Filtrojmë dhomat duke i kthyer në 'any' përkohësisht që të mos ankohet TypeScript 
      // nëse modeli juaj nuk është përditësuar ende në databazë.
      this.filteredRooms = this.rooms.filter((room: any) => 
        room.category?.toLowerCase() === category.toLowerCase()
      );
    }
  }

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