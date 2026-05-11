import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private apiUrl = 'http://localhost:8000/api/bookings/';

  constructor(private http: HttpClient) {}

  getBookings() {
    return this.http.get(this.apiUrl + 'getBookings.php');
  }

  getBooking(id: number) {
    return this.http.get(`${this.apiUrl}getBookings.php?id=${id}`);
  }

  addBooking(booking: any) {
    return this.http.post(this.apiUrl + 'createBooking.php', booking);
  }

  updateBooking(id: number, booking: any) {
    return this.http.put(`${this.apiUrl}updateBooking.php?id=${id}`, booking);
  }

  deleteBooking(id: number) {
    return this.http.delete(`${this.apiUrl}deleteBooking.php?id=${id}`);
  }
}