import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Importo këto

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // Shto HttpClientModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLogin = true;

  loginData = { email: '', password: '' };

  signupData = {
    name: '',
    surname: '',
    email: '',
    password: '',
    confirm: ''
  };

  constructor(private http: HttpClient) {} // Injeksioni i HttpClient

  resetSignupForm() {
    this.signupData = {
      name: '',
      surname: '',
      email: '',
      password: '',
      confirm: ''
    };
  }

  onLogin() {
    console.log('Login Data:', this.loginData);
    // Realizohet ngjashëm me signup
  }

  onSignup() {
    // 1. Validimi i thjeshtë në front-end
    if (this.signupData.password !== this.signupData.confirm) {
      alert("Fjalëkalimet nuk përputhen!");
      return;
    }

    // 2. Përgatitja e objektit për backend (Shtojmë rolin këtu)
    const payload = {
      name: this.signupData.name,
      surname: this.signupData.surname,
      email: this.signupData.email,
      password: this.signupData.password,
      confirm_password: this.signupData.confirm, // Përshtatur me PHP-në që shkruajtëm më parë
      role: 'Client' // Roli i përcaktuar si Client
    };

    // 3. Thirrja e API-së
    const url = 'http://localhost:8000/api/users/createUser.php'; // Ndryshoje sipas rrugës tënde

    this.http.post(url, payload).subscribe({
      next: (res: any) => {
        alert("Sukses: " + res.message);
        this.resetSignupForm();
        this.isLogin = true; // Ktheje te login pas regjistrimit
        
      },
      error: (err) => {
        console.error('Gabim gjatë regjistrimit:', err);
        const errorMsg = err.error?.message || "Ndodhi një gabim gjatë regjistrimit.";
        alert("Gabim: " + errorMsg);
      }
    });
  }

  toggleForm(event: Event) {
    event.preventDefault();
    this.isLogin = !this.isLogin;
  }
}