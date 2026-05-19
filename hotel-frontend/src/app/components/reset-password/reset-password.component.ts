import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router,RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule,RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  formData = {
    email: '',
    new_password: '',
    confirm: ''
  };

  showSuccessModal = false;
  showErrorModal   = false;
  errorMessage     = '';
  isLoading        = false; // ← tregon spinner gjatë kërkesës

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onSubmit() {
    // Validim lokal
    if (!this.formData.email || !this.formData.new_password || !this.formData.confirm) {
      this.errorMessage   = "Ju lutem plotësoni të gjitha fushat.";
      this.showErrorModal = true;
      return;
    }

    if (this.formData.new_password !== this.formData.confirm) {
      this.errorMessage   = "Fjalëkalimet nuk përputhen!";
      this.showErrorModal = true;
      return;
    }

    if (this.formData.new_password.length < 6) {
      this.errorMessage   = "Fjalëkalimi duhet të ketë të paktën 6 karaktere.";
      this.showErrorModal = true;
      return;
    }

    this.isLoading = true;

    const url = 'http://localhost:8000/api/users/resetPassword.php';

    this.http.post(url, this.formData).subscribe({
      next: (res: any) => {
        this.isLoading       = false;
        this.showSuccessModal = true;
      },
      error: (err) => {
        this.isLoading      = false;
        this.errorMessage   = err.error?.message || "Ndodhi një gabim.";
        this.showErrorModal = true;
      }
    });
  }

  // Pas suksesit → kthehu te login
  goToLogin() {
    this.showSuccessModal = false;
    this.router.navigate(['/login']);
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }
}
