import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomService } from '../../services/room.services';
import { StaffService } from '../../services/staff.service';
import { TimetableService } from '../../services/timetable.service';
import { BookingService } from '../../services/booking.service';
import {ContactService} from '../../services/contact.service';

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
  bookings: any[] = [];
  contact :any[]=[];
  activeTab: string = 'rooms';

  showModal: boolean = false;
  selectedBookingId: number | null = null;

  constructor(
    private roomService: RoomService,
    private staffService: StaffService,
    private timetableService: TimetableService,
    private bookingService: BookingService,
    private contactService :ContactService
  ) {}

  ngOnInit(): void {
    this.loadRooms();
    this.loadStaff();
    this.loadTimetables();
    this.loadBookings();
    this.loadContacts();
  }

  loadRooms() {
    this.roomService.getRooms().subscribe((data: any) => {
      if (data && data.status === 'success') {
        this.rooms = data.data;
      }
    });
  }

  loadStaff() {
    this.staffService.getStaff().subscribe((data: any) => {
      if (data && data.status === 'success') {
        this.staff = data.data;
      }
    });
  }

  loadTimetables() {
    this.timetableService.getTimetables().subscribe((data: any) => {
      if (data && data.status === 'success') {
        this.timetables = data.data;
      }
    });
  }

  loadBookings() {
    this.bookingService.getBookings().subscribe({
      next: (data: any) => {
        if (data && data.status === 'success') {
          this.bookings = data.data;
        }
      },
      error: (err) => {
        console.error('Gabim gjatë ngarkimit të rezervimeve:', err);
      }
    });
  }

  loadContacts() {
    this.contactService.getContact().subscribe({
      next: (data: any) => {
        if (data && data.status === 'success') {
          this.contact = data.data;
        }
      },
      error: (err) => {
        console.error('Gabim gjatë ngarkimit të mesazheve:', err);
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


  openDeleteModal(id: number) {
    this.selectedBookingId = id;
    this.showModal = true;
  }

  closeDeleteModal() {
    this.showModal = false;
    this.selectedBookingId = null;
  }

  confirmDelete() {
    if (this.selectedBookingId !== null) {
      this.bookingService.deleteBooking(this.selectedBookingId).subscribe({
        next: () => {
          this.loadBookings();
          this.closeDeleteModal();
        },
        error: (err: any) => {
          console.error("Gabim gjatë fshirjes së rezervimit:", err);
          alert("Fshirja dështoi!");
          this.closeDeleteModal();
        }
      });
    }
  }
}
