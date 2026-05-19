import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/booking.service';
import { RoomService } from '../../services/room.services';
import { RouterLink } from '@angular/router';


declare var paypal: any;

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  bookings: any[]  = [];
  rooms: any[]     = [];
  user: any        = null;   // { id, name, email, role }
  loading          = true;
  selectedRoom: any = null;

  constructor(
    private authService:    AuthService,
    private bookingService: BookingService,
    private roomService:    RoomService,
    private router:         Router
  ) {}

  ngOnInit(): void {
    // Read the logged-in user from localStorage
    this.user = this.authService.getUser();

    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.loadUserBookings();
    this.loadRooms();
  }

  loadUserBookings() {
    this.bookingService.getBookings().subscribe({
      next: (data: any) => {
        if (data.status === 'success') {
          this.bookings = data.data.filter((b: any) => b.user_ID == this.user.id);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Bookings error:', err);
        this.loading = false;
      }
    });
  }
  loadRooms() {
    this.roomService.getRooms().subscribe({
      next: (data: any) => {
        this.rooms = data.status === 'success' ? data.data : [];
      },
      error: (err) => console.error('Rooms error:', err)
    });
  }

  getConfirmedCount(): number {
    return this.bookings.filter(b => b.status === 'Confirmed').length;
  }

  getTotalSpent(): number {
    return this.bookings
      .filter(b => b.status === 'Confirmed')
      .reduce((sum, b) => sum + Number(b.price || 0), 0);
  }

  bookRoom(room: any) {
    this.selectedRoom = room;
    setTimeout(() => {
      paypal.Buttons({
        createOrder: (_data: any, actions: any) =>
          actions.order.create({
            purchase_units: [{
              amount:      { value: room.price.toString() },
              description: `Booking for ${room.name}`
            }]
          }),
        onApprove: (_data: any, actions: any) =>
          actions.order.capture().then(() => {
            this.createBooking(room);
          })
      }).render('#paypal-button-container');
    }, 100);
  }

  createBooking(room: any) {
    const today    = new Date();
    const tomorrow = new Date(today.getTime() + 86400000);

    const newBooking = {
      user_ID:        this.user.id,           // real user ID
      room_ID:        room.room_ID,
      check_In_Date:  today.toISOString().split('T')[0],
      check_Out_Date: tomorrow.toISOString().split('T')[0]
    };

    this.bookingService.addBooking(newBooking).subscribe({
      next: () => {
        alert('Rezervimi u krye me sukses!');
        this.selectedRoom = null;
        this.loadUserBookings();
      },
      error: () => alert('Rezervimi dështoi!')
    });
  }

  cancelBooking(id: number) {
    if (confirm('A jeni të sigurt që dëshironi të anuloni këtë rezervim?')) {
      this.bookingService.updateBooking(id, { status: 'Cancelled' }).subscribe({
        next: () => {
          alert('Rezervimi u anulua.');
          this.loadUserBookings();
        },
        error: () => alert('Anulimi dështoi!')
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
