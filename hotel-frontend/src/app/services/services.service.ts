import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private apiUrl = 'http://localhost:8000/api/services/getService.php';

  constructor(private http: HttpClient) {}

  // 1. Leximi i të gjitha shërbimeve (për menu-në dhe faqen Spa)
  getServices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getServices.php`);
  }

  // 2. Leximi i një shërbimi specifik me ID
  getServiceById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getServices.php?id=${id}`);
  }

  // 3. Krijimi i një shërbimi të ri
  createService(serviceData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createService.php`, serviceData);
  }

  // 4. Përditësimi i një shërbimi (Update)
  updateService(serviceData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateService.php`, serviceData);
  }

  // 5. Fshirja e një shërbimi
  deleteService(id: number): Observable<any> {
    // Dërgojmë ID-në ose në body ose si query param, varet si e kemi lënë te PHP
    return this.http.delete(`${this.apiUrl}/deleteService.php?id=${id}`);
  }
}
