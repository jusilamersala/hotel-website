import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  // 1. Mbaje vetëm deri te folderi
  private apiUrl = 'http://localhost:8000/api/services';

  constructor(private http: HttpClient) {}

  getServices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getService.php`);
  }

  getServiceById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getService.php?id=${id}`);
  }

  createService(serviceData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createService.php`, serviceData);
  }

  updateService(serviceData: any): Observable<any> {
    // Kujdes: Nëse PHP nuk mbështet metodën PUT, përdor POST
    return this.http.post(`${this.apiUrl}/updateService.php`, serviceData);
  }

  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteService.php?id=${id}`);
  }
}
