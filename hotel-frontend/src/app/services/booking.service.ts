import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  // Rruga bazë e API-ve të tu për bookings
  private baseUrl = 'http://localhost:8000/api/bookings';

  constructor(private http: HttpClient) { }

  getBookings(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getBookings.php`);
  }

  getBookingsByUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getBookings.php?user_id=${userId}`);
  }

  // 2. Shto një rezervim të ri
  addBooking(bookingData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/addBooking.php`, bookingData);
  }

  // 3. Përditëso statusin e një rezervimi (p.sh. konfirmo ose anulo)
  updateBooking(id: number, statusData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/updateBooking.php?id=${id}`, statusData);
  }

  // 4. Fshi një rezervim nga sistemi
  deleteBooking(id: number): Observable<any> {
    return this.http.delete(`http://localhost:8000/api/bookings/deleteBooking.php?id=${id}`);
  }
}

