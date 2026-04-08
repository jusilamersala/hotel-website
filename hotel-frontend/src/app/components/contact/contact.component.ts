import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // DUHET për format
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule], // Shto FormsModule këtu
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  constructor(private http: HttpClient) {}

  onSubmit(data: any) {
    // Kjo është URL-ja e saktë e PHP-së tënde
    const url = 'http://localhost/Projekte/hotelProva/backend/contact.php';

    this.http.post(url, data).subscribe({
      next: (res: any) => {
        alert("Sukses: " + res.message);
      },
      error: (err) => {
        console.error("Gabim!", err);
        alert("Ndodhi një gabim gjatë dërgimit.");
      }
    });
  }
}