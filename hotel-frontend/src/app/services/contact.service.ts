import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private baseUrl = 'http://localhost:8000/api/contact';

  constructor(private http: HttpClient) {}

  getContact(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getContact.php`);
  }
}
