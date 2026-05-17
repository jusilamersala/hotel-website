import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  showSuccessModal = false; // ← modal suksesi
  showErrorModal = false;   // ← modal gabimi
  errorMessage = '';        // ← mesazhi i gabimit

  constructor(private http: HttpClient) {}

  onSubmit(data: any) {
    const url = 'http://localhost:8000/api/contact/createContact.php';

    this.http.post(url, data).subscribe({
      next: (res: any) => {
        this.showSuccessModal = true; // ← hap modalin e suksesit
      },
      error: (err) => {
        console.error("Gabim!", err);
        this.errorMessage = err.error?.message || "Ndodhi një gabim në server.";
        this.showErrorModal = true;   // ← hap modalin e gabimit
      }
    });
  }

  closeModal() {
    this.showSuccessModal = false;
    this.showErrorModal = false;
  }
}
