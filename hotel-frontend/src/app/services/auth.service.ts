import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // <-- Kjo rresht është KRITIKE që Angular ta gjejë automatikisht
})
export class AuthService {
  constructor(private http: HttpClient) {}

  getUserProfile(userId: number): Observable<any> {
    return this.http.get(`http://localhost/hotel-backend/get-user.php?user_id=${userId}`);
  }
}