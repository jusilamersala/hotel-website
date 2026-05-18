import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-receptionist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './receptionist.component.html',
  styleUrls: ['./receptionist.component.css']
})
export class ReceptionistComponent implements OnInit {
  bookings: any[] = [];

  // Modeli për rezervimin e dhomës
  newBooking = {
    name: '',
    surname: '',
    room_name: '',
    price: null, 
    check_In_Date: '',
    check_Out_Date: '',
    status: 'Confirmed'
  };

  // Modeli për shërbimet ekstra
  newServiceBooking = {
    booking_ID: '', 
    service_type: '', 
    price: null
  };

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.getBookings().subscribe((data: any) => {
      if (data.status === 'success') {
        // Sigurohemi që çdo rezervim ka një fushë për shërbimet ekstra nëse nuk vjen nga DB
        this.bookings = data.data.map((b: any) => ({
          ...b,
          extra_services: b.extra_services || '',
          price: Number(b.price)
        }));
      }
    });
  }

  createNewBooking() {
    this.bookingService.addBooking(this.newBooking).subscribe({
      next: (response: any) => {
        this.loadBookings();
        this.newBooking = { name: '', surname: '', room_name: '', price: null, check_In_Date: '', check_Out_Date: '', status: 'Confirmed' };
      },
      error: (err: any) => { console.error('Gabim:', err); }
    });
  }

  // Shto shërbimin ekstra direkt te rezervimi i dhomës
  addServiceToBooking() {
    const bookingIndex = this.bookings.findIndex(b => b.booking_ID == this.newServiceBooking.booking_ID);
    
    if (bookingIndex !== -1) {
      // 1. Përditësojmë çmimin total (Dhoma + Shërbimi)
      this.bookings[bookingIndex].price += Number(this.newServiceBooking.price);
      
      // 2. Shtojmë emrin e shërbimit te kolona e dhomës që të duket çfarë ka marrë plus
      const currentServices = this.bookings[bookingIndex].extra_services;
      this.bookings[bookingIndex].extra_services = currentServices 
        ? currentServices + ', ' + this.newServiceBooking.service_type 
        : this.newServiceBooking.service_type;

      alert(`Shërbimi u shtua me sukses te rezervimi #${this.newServiceBooking.booking_ID}!`);
      
      // Këtu në projektin real do bëje një thirrje update në backend që të ruhen në DB:
      // this.bookingService.updateBooking(this.newServiceBooking.booking_ID, this.bookings[bookingIndex]).subscribe();

      // Resetojmë formularin e shërbimit
      this.newServiceBooking = { booking_ID: '', service_type: '', price: null };
    }
  }

  updateBookingStatus(id: number, event: Event) {
    const status = (event.target as HTMLSelectElement).value;
    this.bookingService.updateBooking(id, { status }).subscribe(() => { this.loadBookings(); });
  }

  deleteBooking(id: number) {
    if (confirm('A jeni i sigurt?')) {
      this.bookingService.deleteBooking(id).subscribe(() => { this.loadBookings(); });
    }
  }
}