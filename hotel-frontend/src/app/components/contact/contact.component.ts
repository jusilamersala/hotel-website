import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
// 1. Importo shërbimin tënd (kujdes path-in, varet ku e ke krijuar folderin services)
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  constructor(
    private http: HttpClient,
    private toast: ToastService
  ) {}

  onSubmit(data: any) {
    // Sigurohu që kjo URL hapet në browser-in tënd
    const url = 'http://localhost:8000/api/contact/createContact.php';

    this.http.post(url, data).subscribe({
      next: (res: any) => {
        this.toast.showSuccess(res.message || "Mesazhi u dërgua me sukses!");
      },
      error: (err) => {
        console.error("Gabim!", err);
        const errorMessage = err.error?.message || "Ndodhi një gabim në server.";

        // 3. Përdor showError në vend të alert
        this.toast.showError(errorMessage);
      }
    });
  }
}
