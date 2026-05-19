import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { HttpClient } from '@angular/common/http'; 

@Component({
  selector: 'app-receptionist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './receptionist.component.html',
  styleUrls: ['./receptionist.component.css']
})
export class ReceptionistComponent implements OnInit {

  // Koleksioni për menaxhimin e rreshtave të tabelës Walk-In
  walkIns: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Çelim rreshtin e parë bosh sapo hapet faqja
    this.addEmptyWalkInRow();
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

  // Ruajtja e klientit Walk-In në Databazë
  saveWalkIn(walkInRow: any) {
    if (!walkInRow.room_type || !walkInRow.price || !walkInRow.check_In_Date || !walkInRow.check_Out_Date) {
      alert('Ju lutem plotësoni të paktën Dhomën, Çmimin dhe Datat e qëndrimit!');
      return;
    }

    // Ndërtojmë payload-in që kërkon backend-i yt (shto emrin/mbiemrin nëse backend i pranon)
    const bookingPayload = {
      name: walkInRow.name,
      surname: walkInRow.surname,
      room_type: walkInRow.room_type,
      extra_service: walkInRow.extra_service,
      service_price: walkInRow.service_price ? Number(walkInRow.service_price) : 0,
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
        
        // Largon rreshtin e plotësuar nga tabela e përkohshme Walk-In pas ruajtjes së suksesshme
        this.walkIns = this.walkIns.filter(w => w !== walkInRow);
        
        // Nëse nuk ka më rreshta, shto automatikisht një bosh që të mos mbetet tabela zbrazët
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
}