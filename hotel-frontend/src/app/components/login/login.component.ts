import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Toggle between login/signup
  isLogin = true;

  // Login form data
  loginData = {
    email: '',
    password: ''
  };

  // Signup form data
  signupData = {
    name: '',
    email: '',
    password: '',
    confirm: ''
  };

  // Login submit
  onLogin() {
    console.log('Login Data:', this.loginData);
    // TODO: Add real login logic here
  }

  // Signup submit
  onSignup() {
    console.log('Signup Data:', this.signupData);
    // TODO: Add real signup logic here
  }

  // Toggle forms
  toggleForm(event: Event) {
    event.preventDefault();
    this.isLogin = !this.isLogin;
  }
}