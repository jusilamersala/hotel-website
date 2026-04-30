import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLogin = true;

  // Të dhënat për Login
  loginData = {
    email: '',
    password: ''
  };

  // Të dhënat për Signup
  signupData = {
    name: '',
    surname: '',
    email: '',
    password: '',
    confirm: ''
  };

  constructor(private http: HttpClient) {}

  resetSignupForm() {
    this.signupData = {
      name: '',
      surname: '',
      email: '',
      password: '',
      confirm: ''
    };
  }

  // --- FUNKSIONI I LOGIN-IT (I SHTUAR) ---
  onLogin() {
    if (!this.loginData.email || !this.loginData.password) {
      alert("Ju lutem plotësoni të gjitha fushat!");
      return;
    }

    const url = 'http://localhost:8000/api/users/loginUser.php';

    this.http.post(url, this.loginData).subscribe({
      next: (res: any) => {
        console.log('Login Success:', res);
        alert("Mirëseerdhët, " + res.user.name + "!");

        // Ruajmë të dhënat e përdoruesit në localStorage
        localStorage.setItem('user', JSON.stringify(res.user));
      },
      error: (err) => {
        console.error('Gabim gjatë login-it:', err);
        const errorMsg = err.error?.message || "Email ose fjalëkalim i gabuar.";
        alert("Gabim: " + errorMsg);
      }
    });
  }

  // --- FUNKSIONI I REGJISTRIMIT ---
  onSignup() {
    if (this.signupData.password !== this.signupData.confirm) {
      alert("Fjalëkalimet nuk përputhen!");
      return;
    }

    const payload = {
      name: this.signupData.name,
      surname: this.signupData.surname,
      email: this.signupData.email,
      password: this.signupData.password,
      confirm_password: this.signupData.confirm,
      role: 'Client'
    };

    const url = 'http://localhost:8000/api/users/createUser.php';

    this.http.post(url, payload).subscribe({
      next: (res: any) => {
        alert("Sukses: " + res.message);
        this.resetSignupForm();
        this.isLogin = true;
      },
      error: (err) => {
        console.error('Gabim gjatë regjistrimit:', err);
        const errorMsg = err.error?.message || "Ndodhi një gabim.";
        alert("Gabim: " + errorMsg);
      }
    });
  }

  toggleForm(event: Event) {
    event.preventDefault();
    this.isLogin = !this.isLogin;
  }
}
