import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private apiUrl = 'http://localhost:8000/api/bookings/';

  constructor(private http: HttpClient) {}


  getBookings(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'getBookings.php');
  }


  getBooking(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getBookings.php?id=${id}`);
  }

  addBooking(booking: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'createBooking.php', booking);
  }

  updateBooking(id: number, booking: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}updateBooking.php?id=${id}`, booking);
  }

  
  deleteBooking(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}deleteBooking.php?id=${id}`);
  }
}