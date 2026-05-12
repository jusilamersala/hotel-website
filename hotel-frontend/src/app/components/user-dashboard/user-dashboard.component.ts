import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { RoomService } from '../../services/room.services';

declare var paypal: any;

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit, AfterViewInit {
  bookings: any[] = [];
  rooms: any[] = [];
  userId: number = 1; // Supozojmë se ID e përdoruesit të loguar është 1
  loading: boolean = true;
  selectedRoom: any = null;

  constructor(
    private bookingService: BookingService, 
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // PayPal button will be rendered when needed
  }

  ngOnInit(): void {
    this.loadData();
  }

  // Ngarkon të dhënat paralelisht
  loadData() {
    this.loading = true;
    this.loadUserBookings();
    this.loadRooms();
  }

  loadUserBookings() {
    this.bookingService.getBookings().subscribe({
      next: (data: any) => {
        if (data.status === 'success') {
          // Filtrojmë rezervimet vetëm për këtë përdorues
          this.bookings = data.data.filter((b: any) => b.user_ID == this.userId);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error("Gabim gjatë ngarkimit të rezervimeve:", err);
        this.loading = false;
      }
    });
  }

  loadRooms() {
    this.roomService.getRooms().subscribe({
      next: (data: any) => {
        if (data.status === 'success') {
          this.rooms = data.data;
        }
      },
      error: (err) => console.error("Gabim gjatë ngarkimit të dhomave:", err)
    });
  }

  // --- Funksionet Ndihmëse për HTML ---

  getConfirmedCount(): number {
    return this.bookings.filter(b => b.status === 'Confirmed').length;
  }

  getTotalSpent(): number {
    return this.bookings
      .filter(b => b.status === 'Confirmed')
      .reduce((sum, b) => sum + Number(b.price || 0), 0);
  }

  // --- Aksionet ---

  bookRoom(room: any) {
    this.selectedRoom = room;
    // Render PayPal button
    setTimeout(() => {
      paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: room.price.toString()
              },
              description: `Booking for ${room.name}`
            }]
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            // Payment successful, create booking
            this.createBooking(room);
            alert('Payment successful! Booking confirmed.');
          });
        }
      }).render('#paypal-button-container');
    }, 100);
  }

  createBooking(room: any) {
    const newBooking = {
      user_ID: this.userId,
      room_ID: room.room_ID,
      check_In_Date: new Date().toISOString().split('T')[0], // Sot
      check_Out_Date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Nesër
    };

    this.bookingService.addBooking(newBooking).subscribe(() => {
      alert("Rezervimi u krye me sukses!");
      this.loadUserBookings(); // Rifresko listën
      this.selectedRoom = null;
    });
  }

  cancelBooking(id: number) {
    if (confirm("A jeni të sigurt që dëshironi të anuloni këtë rezervim?")) {
      this.bookingService.updateBooking(id, { status: 'Cancelled' }).subscribe({
        next: () => {
          alert("Rezervimi u anulua.");
          this.loadUserBookings();
        },
        error: (err) => alert("Anulimi dështoi!")
      });
    }
  }
}