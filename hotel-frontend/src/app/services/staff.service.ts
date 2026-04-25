import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StaffService {
  private apiUrl = 'http://localhost:8000/api/staff/';

  constructor(private http: HttpClient) {}

  getStaff() {
    return this.http.get(this.apiUrl + 'getStaff.php');
  }

  getStaffMember(id: number) {
    return this.http.get(`${this.apiUrl}getStaff.php?id=${id}`);
  }

  addStaff(staff: any) {
    return this.http.post(this.apiUrl + 'createStaff.php', staff);
  }

  updateStaff(id: number, staff: any) {
    return this.http.put(`${this.apiUrl}updateStaff.php?id=${id}`, staff);
  }

  deleteStaff(id: number) {
    return this.http.delete(`${this.apiUrl}deleteStaff.php?id=${id}`);
  }
}