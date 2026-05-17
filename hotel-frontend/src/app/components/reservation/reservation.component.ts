import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent implements OnInit {

  currentStep = 1;

  // Dhoma
  room: any = null;

  // Datat
  checkIn     = '';
  checkOut    = '';
  totalNights = 0;
  totalPrice  = 0;

  // Kontakti
  phone = '';

  // Pagesa
  paymentMethod = 'cash';

  // User
  user: any = null;

  // Modalet
  showSuccessModal = false;
  showErrorModal   = false;
  errorMessage     = '';
  isLoading        = false;

  // Data minimale sot
  today = new Date().toISOString().split('T')[0];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();

    const roomId = this.route.snapshot.paramMap.get('id');
    if (roomId) {
      this.http.get(`http://localhost:8000/api/bookings/getRoom.php?id=${roomId}`)
        .subscribe({
          next:  (data: any) => { this.room = data; },
          error: () => { this.router.navigate(['/rooms']); }
        });
    }
  }

  calculateTotal() {
    if (this.checkIn && this.checkOut) {
      const start = new Date(this.checkIn);
      const end   = new Date(this.checkOut);
      const diff  = Math.floor(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diff > 0) {
        this.totalNights = diff;
        this.totalPrice  = diff * this.room?.price;
      } else {
        this.totalNights = 0;
        this.totalPrice  = 0;
      }
    }
  }

  nextStep() {
    // Validim para se të kalojë hapin
    if (this.currentStep === 2) {
      if (!this.checkIn || !this.checkOut || this.totalNights <= 0) {
        this.errorMessage   = "Ju lutem zgjidhni datat e vlefshme!";
        this.showErrorModal = true;
        return;
      }
    }
    if (this.currentStep === 3) {
      if (!this.phone) {
        this.errorMessage   = "Ju lutem vendosni numrin e telefonit!";
        this.showErrorModal = true;
        return;
      }
    }
    if (this.currentStep < 4) this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  onSubmit() {
    this.isLoading = true;

    const payload = {
      user_ID:        this.user.id,
      room_ID:        this.room.room_ID,
      check_in:       this.checkIn,
      check_out:      this.checkOut,
      total_nights:   this.totalNights,
      total_price:    this.totalPrice,
      phone:          this.phone,
      payment_method: this.paymentMethod
    };

    this.http.post(
      'http://localhost:8000/api/bookings/createBooking.php',
      payload
    ).subscribe({
      next: () => {
        this.isLoading        = false;
        this.showSuccessModal = true;
      },
      error: (err) => {
        this.isLoading      = false;
        this.errorMessage   = err.error?.message || "Ndodhi një gabim.";
        this.showErrorModal = true;
      }
    });
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }
}
