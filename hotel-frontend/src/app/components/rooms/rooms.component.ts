import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Room } from './room.model'; // Sigurohu që path-i është i saktë

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchRooms();
  }

  fetchRooms() {
    this.http.get<Room[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.rooms = data;
      },
      error: (err) => {
        console.error('Gabim gjatë marrjes së dhomave:', err);
      }
    });
  }
}