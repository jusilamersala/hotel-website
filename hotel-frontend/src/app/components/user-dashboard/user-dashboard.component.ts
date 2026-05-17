import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { RoomService } from '../../services/room.services';
import { AuthService } from '../../services/auth.service'; 

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
  userId: number = 1; 
  loading: boolean = true;
  selectedRoom: any = null;
  currentUser: any = null; 

  constructor(
    private bookingService: BookingService,
    private roomService: RoomService,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // PayPal button do të renderohet dinamikisht kur kërkohet pagesa
  }

  /*ngOnInit(): void {
    this.loadData();
  }*/

  // Ngarkon të dhënat paralelisht
  loadData() {
    this.loading = true;
    this.loadUserProfile(); 
    this.loadUserBookings();
    this.loadRooms();
  }

  // U rregullua gabimi TS7006 duke i shtuar tipin (err: any)
  loadUserProfile() {
    this.authService.getUserProfile(this.userId).subscribe({
      next: (data: any) => {
        if (data.status === 'success') {
          this.currentUser = data.data; 
        }
      },
      error: (err: any) => { // <-- Kjo u rregullua këtu
        console.error("Gabim gjatë ngarkimit të profilit të përdoruesit:", err);
      }
    });
  }

  loadUserBookings() {
    this.bookingService.getBookings().subscribe({
      next: (data: any) => {
        if (data.status === 'success') {
          this.bookings = data.data.filter((b: any) => b.user_ID == this.userId);
        }
        this.loading = false;
      },
      error: (err: any) => {
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
      error: (err: any) => console.error("Gabim gjatë ngarkimit të dhomave:", err)
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

  generatePDF() {
    if (this.getConfirmedCount() === 0) {
      alert("Nuk ka asnjë rezervim të konfirmuar për të gjeneruar faturë!");
      return;
    }

    const backendUrl = `http://localhost/hotel-website/hotel-backend/gjenero-fature.php?user_id=${this.userId}`;
    window.open(backendUrl, '_blank');
  }

  // --- Aksionet e Rezervimit dhe Pagesës ---

  bookRoom(room: any) {
    this.selectedRoom = room;
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
            this.createBooking(room);
          });
        }
      }).render('#paypal-button-container');
    }, 100);
  }

  createBooking(room: any) {
    const newBooking = {
      user_ID: this.userId,
      room_ID: room.room_ID,
      check_In_Date: new Date().toISOString().split('T')[0], 
      check_Out_Date: new Date(Date.now() + 86400000).toISOString().split('T')[0], 
    };

    this.bookingService.addBooking(newBooking).subscribe(() => {
      alert("Rezervimi u krye me sukses! Pagesa u konfirmua.");
      this.loadUserBookings(); 
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
        error: (err: any) => alert("Anulimi dështoi!")
      });
    }
  }
}