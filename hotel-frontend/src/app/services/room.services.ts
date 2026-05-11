import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private apiUrl = 'http://localhost:8000/api/rooms/';

  constructor(private http: HttpClient) {}

  getRooms() {
    return this.http.get(this.apiUrl + 'getRooms.php');
  }

  getRoom(id: number) {
    return this.http.get(`${this.apiUrl}getRooms.php?id=${id}`);
  }

  addRoom(room: any) {
    return this.http.post(this.apiUrl + 'createRoom.php', room);
  }

  updateRoom(id: number, room: any) {
    return this.http.put(`${this.apiUrl}updateRoom.php?id=${id}`, room);
  }

  deleteRoom(id: number) {
    return this.http.delete(`${this.apiUrl}deleteRoom.php?id=${id}`);
  }
}