import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-receptionist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receptionist.component.html',
  styleUrls: ['./receptionist.component.css']
})
export class ReceptionistComponent implements OnInit {
  bookings: any[] = [];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.getBookings().subscribe((data: any) => {
      if (data.status === 'success') {
        this.bookings = data.data;
      }
    });
  }

  updateBookingStatus(id: number, event: Event) {
    const status = (event.target as HTMLSelectElement).value;
    this.bookingService.updateBooking(id, { status }).subscribe(() => {
      this.loadBookings();
    });
  }

  deleteBooking(id: number) {
    this.bookingService.deleteBooking(id).subscribe(() => {
      this.loadBookings();
    });
  }
}