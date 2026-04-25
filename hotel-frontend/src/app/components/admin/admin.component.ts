import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomService } from '../../services/room.services';
import { StaffService } from '../../services/staff.service';
import { TimetableService } from '../../services/timetable.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  rooms: any[] = [];
  staff: any[] = [];
  timetables: any[] = [];
  activeTab: string = 'rooms';

  constructor(
    private roomService: RoomService,
    private staffService: StaffService,
    private timetableService: TimetableService
  ) {}

  ngOnInit(): void {
    this.loadRooms();
    this.loadStaff();
    this.loadTimetables();
  }

  loadRooms() {
    this.roomService.getRooms().subscribe((data: any) => {
      if (data.status === 'success') {
        this.rooms = data.data;
      }
    });
  }

  loadStaff() {
    this.staffService.getStaff().subscribe((data: any) => {
      if (data.status === 'success') {
        this.staff = data.data;
      }
    });
  }

  loadTimetables() {
    this.timetableService.getTimetables().subscribe((data: any) => {
      if (data.status === 'success') {
        this.timetables = data.data;
      }
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Room CRUD
  addRoom() {
    // Implement modal or form
  }

  editRoom(room: any) {
    // Implement
  }

  deleteRoom(id: number) {
    this.roomService.deleteRoom(id).subscribe(() => {
      this.loadRooms();
    });
  }

  // Staff CRUD
  addStaff() {
    // Implement
  }

  editStaff(staff: any) {
    // Implement
  }

  deleteStaff(id: number) {
    this.staffService.deleteStaff(id).subscribe(() => {
      this.loadStaff();
    });
  }

  // Timetable CRUD
  addTimetable() {
    // Implement
  }

  editTimetable(timetable: any) {
    // Implement
  }

  deleteTimetable(id: number) {
    this.timetableService.deleteTimetable(id).subscribe(() => {
      this.loadTimetables();
    });
  }
}