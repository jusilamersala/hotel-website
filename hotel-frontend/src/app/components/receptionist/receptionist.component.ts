import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { HttpClient } from '@angular/common/http'; 
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

  // Koleksioni për menaxhimin e rreshtave të tabelës Walk-In
  walkIns: any[] = [
    {
      name: '',
      surname: '',
      room_type: '',
      price: null,
      extra_service: '',
      service_price: 0,
      check_In_Date: '',
      check_Out_Date: '',
      status: 'Confirmed'
    }
  ];

  // Modeli për rezervimin e dhomës nga formulari i vjetër
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

  constructor(
    private bookingService: BookingService,
    private http: HttpClient 
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  // PËRDITËSUAR: Ngarkon të gjitha rezervimet aktive duke mapuar kolonat e sakta të SQL-së së re
  loadBookings() {
    this.bookingService.getBookings().subscribe((data: any) => {
      if (data.status === 'success') {
        this.bookings = data.data.map((b: any) => ({
          booking_ID: b.booking_ID,
          name: b.name,
          surname: b.surname,
          room_name: b.room_name,              // Mapohet nga r.name AS room_name
          price: Number(b.total_price),        // Mapohet nga b.total_price
          check_In_Date: b.check_In_Date,
          check_Out_Date: b.check_Out_Date,
          status: b.status,
          extra_service: b.extra_service || '', 
          service_price: b.service_price ? Number(b.service_price) : 0
        }));
        console.log('Rezervimet aktive u ngarkuan:', this.bookings);
      }
    });
  }

  // Krijimi i një rezervimi nga formulari i parë
  createNewBooking() {
    this.bookingService.addBooking(this.newBooking).subscribe({
      next: (response: any) => {
        this.loadBookings();
        this.newBooking = { name: '', surname: '', room_name: '', price: null, check_In_Date: '', check_Out_Date: '', status: 'Confirmed' };
      },
      error: (err: any) => { console.error('Gabim:', err); }
    });
  }

  // Shto një rresht të ri bosh te tabela Walk-In në HTML
  addEmptyWalkInRow() {
    this.walkIns.push({
      name: '',
      surname: '',
      room_type: '',
      price: null,
      extra_service: '',
      service_price: 0,
      check_In_Date: '',
      check_Out_Date: '',
      status: 'Confirmed'
    });
  }

  // PËRDITËSUAR: Ruajtja e klientit Walk-In pa fushat problematike
  saveWalkIn(walkInRow: any) {
    if (!walkInRow.room_type || !walkInRow.price || !walkInRow.check_In_Date || !walkInRow.check_Out_Date) {
      alert('Ju lutem plotësoni të paktën Dhomën, Çmimin dhe Datat e qëndrimit!');
      return;
    }

    // Ndërtojmë payload-in e pastër që kërkon 'createWalkIn.php' i ri
    const bookingPayload = {
      check_In_Date: walkInRow.check_In_Date,
      check_Out_Date: walkInRow.check_Out_Date,
      price: Number(walkInRow.price),
      status: walkInRow.status
    };

    console.log('Duke dërguar të dhënat te createWalkIn.php:', bookingPayload);

    const url = 'http://localhost:8000/api/bookings/createWalkIn.php';

    this.http.post(url, bookingPayload).subscribe({
      next: (response: any) => {
        alert('Klienti Walk-In u regjistrua me sukses në databazë!');
        this.loadBookings(); // Rifreskon listën kryesore automatikisht
        
        // Largon rreshtin e plotësuar nga tabela e përkohshme Walk-In
        this.walkIns = this.walkIns.filter(w => w !== walkInRow);
        if (this.walkIns.length === 0) {
          this.addEmptyWalkInRow();
        }
      },
      error: (err: any) => {
        console.error('Gabim nga serveri:', err);
        if (err.error && err.error.message) {
          alert(`Gabim: ${err.error.message}`);
        } else {
          alert('Ndodhi një gabim gjatë ruajtjes. Kontrollo console log.');
        }
      }
    });
  }

  // Shto shërbimin ekstra direkt te rezervimi ekzistues
  addServiceToBooking() {
    const bookingIndex = this.bookings.findIndex(b => b.booking_ID == this.newServiceBooking.booking_ID);
    
    if (bookingIndex !== -1) {
      this.bookings[bookingIndex].service_price = Number(this.newServiceBooking.price);
      
      const currentServices = this.bookings[bookingIndex].extra_service;
      this.bookings[bookingIndex].extra_service = currentServices 
        ? currentServices + ', ' + this.newServiceBooking.service_type 
        : this.newServiceBooking.service_type;

      const numericID = Number(this.newServiceBooking.booking_ID);

      this.bookingService.updateBooking(numericID, this.bookings[bookingIndex]).subscribe(() => {
        this.loadBookings();
        alert(`Shërbimi u shtua dhe u ruajt në DB për rezervimin #${numericID}!`);
      });

      this.newServiceBooking = { booking_ID: '', service_type: '', price: null };
    }
  }

  // Përditësimi i statusit të rezervimit (Pending, Confirmed, Cancelled)
  updateBookingStatus(id: number, event: Event) {
    const status = (event.target as HTMLSelectElement).value;
    this.bookingService.updateBooking(id, { status }).subscribe(() => { this.loadBookings(); });
  }

  // Fshirja e një rezervimi
  deleteBooking(id: number) {
    if (confirm('A jeni i sigurt që dëshironi ta fshini këtë rezervim?')) {
      this.bookingService.deleteBooking(id).subscribe(() => { this.loadBookings(); });
    }
  }
}