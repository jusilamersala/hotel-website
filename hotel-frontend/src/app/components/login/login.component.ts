import { Component, OnInit } from '@angular/core'; // Shtuar OnInit
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router'; // Per lexim Url

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit { // Implemento OnInit
  isLogin = true;
  successMsg: string | null = null; // Variabël për mesazhet pozitive

  loginData = { email: '', password: '' };
  signupData = { name: '', surname: '', email: '', password: '', confirm: '' };

  // Injekto ActivatedRoute në constructor
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    // KONTROLLI I URL-së: Shikon nëse ka "?verified=true"
    this.route.queryParams.subscribe(params => {
      if (params['verified'] === 'true') {
        this.successMsg = "Email-i u konfirmua me sukses! Tani mund të kyçeni.";
        // E fshijmë mesazhin pas 5 sekondash
        setTimeout(() => this.successMsg = null, 5000);
      }

      // ← SHTO KETE: hap direkt signup kur vjen nga modali
      if (params['mode'] === 'signup') {
        this.isLogin = false;
      }
    });
  }

  onLogin() {
    if (!this.loginData.email || !this.loginData.password) {
      alert("Ju lutem plotësoni të gjitha fushat!");
      return;
    }

    const url = 'http://localhost:8000/api/users/loginUser.php';

    this.http.post(url, this.loginData).subscribe({
      next: (res: any) => {
        alert("Mirëseerdhët, " + res.user.name + "!");
        localStorage.setItem('user', JSON.stringify(res.user));
      },
      error: (err) => {
        // Kapim mesazhin specifik "Llogaria nuk është aktivizuar" nga PHP
        const errorMsg = err.error?.message || "Email ose fjalëkalim i gabuar.";
        alert(errorMsg);
      }
    });
  }

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
        // Njoftojmë përdoruesin që duhet të kontrollojë email-in
        alert("Regjistrimi u krye! Ju lutem kontrolloni email-in për të aktivizuar llogarinë.");
        this.resetSignupForm();
        this.isLogin = true;
      },
      error: (err) => {
        const errorMsg = err.error?.message || "Ndodhi një gabim.";
        alert("Gabim: " + errorMsg);
      }
    });
  }

  resetSignupForm() {
    this.signupData = { name: '', surname: '', email: '', password: '', confirm: '' };
  }

  toggleForm(event: Event) {
    event.preventDefault();
    this.isLogin = !this.isLogin;
    this.successMsg = null; // Hiq mesazhin nëse ndërron formën
  }
}
