import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TimetableService {
  private apiUrl = 'http://localhost:8000/api/timetables/';

  constructor(private http: HttpClient) {}

  getTimetables() {
    return this.http.get(this.apiUrl + 'getTimetables.php');
  }

  getTimetable(id: number) {
    return this.http.get(`${this.apiUrl}getTimetables.php?id=${id}`);
  }

  addTimetable(timetable: any) {
    return this.http.post(this.apiUrl + 'createTimetable.php', timetable);
  }

  updateTimetable(id: number, timetable: any) {
    return this.http.put(`${this.apiUrl}updateTimetable.php?id=${id}`, timetable);
  }

  deleteTimetable(id: number) {
    return this.http.delete(`${this.apiUrl}deleteTimetable.php?id=${id}`);
  }
}