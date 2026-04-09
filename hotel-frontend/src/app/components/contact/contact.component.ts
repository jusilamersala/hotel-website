import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Shto HttpClientModule këtu
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule], // DUHET ta shtosh këtu HttpClientModule
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  constructor(private http: HttpClient) {}

  onSubmit(data: any) {
    // Sigurohu që kjo URL hapet në browser-in tënd
    const url = 'http://localhost:8000/models/contact.php'

    this.http.post(url, data).subscribe({
      next: (res: any) => {
        // res.message vjen nga JSON-i që shkruajtëm në PHP
        alert("Sukses: " + (res.message || "U dërgua!"));
      },
      error: (err) => {
        console.error("Gabim!", err);
        alert("Ndodhi një gabim gjatë dërgimit. Shiko Console (F12).");
      }
    });
  }
}
