import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
declare var paypal: any;

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent implements OnInit {

  currentStep = 1;
  room: any = null;
  checkIn = '';
  checkOut = '';
  totalNights = 0;
  totalPrice = 0;

  extraServices = [
    { id: 1, name: 'Pishinë & Spa', price: 15, selected: false },
    { id: 2, name: 'Gym & Fitness', price: 10, selected: false },
    { id: 3, name: 'Terapi Masazhi', price: 30, selected: false }
  ];

  phone = '';
  paymentMethod = 'cash';
  user: any = null;
  showSuccessModal = false;
  showErrorModal = false;
  errorMessage = '';
  isLoading = false;
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
          next: (data: any) => { this.room = data; },
          error: () => { this.router.navigate(['/rooms']); }
        });
    }
  }

  calculateTotal() {
    if (this.checkIn && this.checkOut) {
      const start = new Date(this.checkIn);
      const end = new Date(this.checkOut);
      const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      if (diff > 0) {
        this.totalNights = diff;
        const servicesPrice = this.extraServices
          .filter(s => s.selected)
          .reduce((sum, s) => sum + s.price, 0);
        this.totalPrice = (diff * this.room?.price) + servicesPrice;
      } else {
        this.totalNights = 0;
        this.totalPrice = 0;
      }
    }
  }

  getSelectedServices() {
    return this.extraServices.filter(s => s.selected);
  }

  getSelectedServicesNames() {
    return this.getSelectedServices().map(s => s.name).join(', ');
  }

  setupPaypal() {
    this.paymentMethod = 'paypal';
    setTimeout(() => {
      this.renderPaypalButtons();
    }, 150);
  }

  renderPaypalButtons() {
    const container = document.getElementById('paypal-button-container');
    const paypalSdk = (window as any).paypal;

    if (!paypalSdk) {
      console.log("Duke pritur SDK-në e PayPal...");
      setTimeout(() => this.renderPaypalButtons(), 500);
      return;
    }

    if (container) {
      container.innerHTML = '';

      paypalSdk.Buttons({
        style: {
          layout: 'vertical',
          color:  'gold',
          shape:  'rect',
          label:  'paypal'
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                currency_code: 'EUR',
                value: this.totalPrice.toString()
              },
              description: `Rezervim: ${this.room?.name || 'Dhoma Hotel'}`
            }]
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then(() => {
            console.log('Pagesa u krye me sukses!');
            this.onSubmit();
          });
        },
        onError: (err: any) => {
          console.error('PayPal Error:', err);
          this.errorMessage = "Pati një problem me dritaren e PayPal.";
          this.showErrorModal = true;
        }
      }).render('#paypal-button-container');
    } else {
      setTimeout(() => this.renderPaypalButtons(), 100);
    }
  }

  nextStep() {
    if (this.currentStep === 2) {
      if (!this.checkIn || !this.checkOut || this.totalNights <= 0) {
        this.errorMessage = "Ju lutem zgjidhni datat e vlefshme!";
        this.showErrorModal = true;
        return;
      }
    }
    if (this.currentStep === 3) {
      if (!this.phone) {
        this.errorMessage = "Ju lutem vendosni numrin e telefonit!";
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
      user_ID: this.user.id,
      room_ID: this.room.room_ID,
      check_in: this.checkIn,
      check_out: this.checkOut,
      total_nights: this.totalNights,
      total_price: this.totalPrice,
      phone: this.phone,
      payment_method: this.paymentMethod,
      services: this.getSelectedServicesNames()
    };

    this.http.post('http://localhost:8000/api/bookings/createBooking.php', payload)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.showSuccessModal = true;
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || "Ndodhi një gabim gjatë ruajtjes.";
          this.showErrorModal = true;
        }
      });
  }

  generatePDF() {
    if (!this.room) return;

    const doc = new jsPDF();

    // Stilimi i titullit
    doc.setFontSize(22);
    doc.setTextColor(197, 160, 89);
    doc.text('GRAND HORIZON - LUXURY HOTEL', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Vlorë, Albania | www.grandhorizon.al', 105, 27, { align: 'center' });

    // Informacioni i Faturës
    doc.setDrawColor(200);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Fatura: #GH-2026-${this.room.room_ID}`, 20, 45);
    doc.text(`Data: ${this.today}`, 20, 52);

    // Informacioni i Klientit
    doc.setFont("helvetica", "bold");
    doc.text('Detajet e Klientit:', 20, 65);
    doc.setFont("helvetica", "normal");
    doc.text(`Emri: ${this.user?.name}`, 20, 72);
    doc.text(`Email: ${this.user?.email}`, 20, 79);
    doc.text(`Tel: ${this.phone}`, 20, 86);

    // Tabela e Sherbimeve
    const head = [['Përshkrimi', 'Çmimi']];
    const data: any[] = [
      [`Akomodimi: ${this.room.name} (${this.totalNights} netë)`, `${this.totalNights * this.room.price}€`],
      ...this.getSelectedServices().map(s => [s.name, `${s.price}€`]),
      [{ content: 'TOTALI', styles: { fontStyle: 'bold' } }, { content: `${this.totalPrice}€`, styles: { fontStyle: 'bold' } }]
    ];

    autoTable(doc, {
      startY: 95,
      head: head,
      body: data,
      theme: 'striped',
      headStyles: { fillColor: [197, 160, 89] },
      margin: { left: 20, right: 20 }
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text('Faleminderit që zgjodhët Grand Horizon! Ju presim së shpejti.', 105, finalY + 10, { align: 'center' });

    // Shkarkimi i PDF
    doc.save(`Fatura_GrandHorizon_${this.user?.name.replace(/\s+/g, '_')}.pdf`);
  }

  goToHome() { this.router.navigate(['/home']); }
  closeErrorModal() { this.showErrorModal = false; }
}
