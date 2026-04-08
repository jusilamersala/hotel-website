import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private apiUrl = 'http://localhost/api/rooms.php';

  constructor(private http: HttpClient) {}

  getRooms() {
    return this.http.get(this.apiUrl);
  }

  addRoom(room: any) {
    return this.http.post(this.apiUrl, room);
  }

  updateRoom(room: any) {
    return this.http.put(this.apiUrl, room);
  }

  deleteRoom(id: number) {
    return this.http.delete(`${this.apiUrl}?id=${id}`);
  }
}