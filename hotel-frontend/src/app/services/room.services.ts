import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoomService {
  // Përdorim apiUrl në të gjithë skedarin për konsistencë
  private apiUrl = 'http://localhost:8000/api/room/';

  constructor(private http: HttpClient) {}

  getRooms(): Observable<any> {
    return this.http.get(`${this.apiUrl}getRooms.php`);
  }

  getRoom(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}getRoom.php?id=${id}`);
  }

  addRoom(room: any): Observable<any> {
    return this.http.post(`${this.apiUrl}createRoom.php`, room);
  }

  updateRoom(id: number, room: any): Observable<any> {
    return this.http.put(`${this.apiUrl}updateRoom.php?id=${id}`, room);
  }

  deleteRoom(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}deleteRoom.php?id=${id}`);
  }
}
