import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isLogin = true;
  successMsg: string | null = null;
  showAuthModal = false;

  loginData = { email: '', password: '' };
  signupData = { name: '', surname: '', email: '', password: '', confirm: '' };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['verified'] === 'true') {
        this.successMsg = 'Email-i u konfirmua me sukses! Tani mund të kyçeni.';
        setTimeout(() => (this.successMsg = null), 5000);
      }
      if (params['mode'] === 'signup') {
        this.isLogin = false;
      }
    });
  }

  onLogin() {
    if (!this.loginData.email || !this.loginData.password) {
      alert('Ju lutem plotësoni të gjitha fushat!');
      return;
    }

    const url = 'http://localhost:8000/api/users/loginUser.php';
    this.http.post(url, this.loginData).subscribe({
      next: (res: any) => {
        this.authService.setUser(res.user);

        // KONTROLLI I ROLIT:
        // Kontrollojmë nëse roli është 'Admin' (sigurohu që shkruhet saktë si në databazë)
        if (res.user && res.user.role === 'Admin') {
          this.router.navigate(['/admin']);
        } else if (res.user && res.user.role === 'Receptionist') {
          this.router.navigate(['/receptionist']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Email ose fjalëkalim i gabuar.';
        alert(errorMsg);
      },
    });
  }

  onSignup() {
    if (this.signupData.password !== this.signupData.confirm) {
      alert('Fjalëkalimet nuk përputhen!');
      return;
    }

    const payload = {
      name: this.signupData.name,
      surname: this.signupData.surname,
      email: this.signupData.email,
      password: this.signupData.password,
      confirm_password: this.signupData.confirm,
      role: 'Client',
    };

    const url = 'http://localhost:8000/api/users/createUser.php';

    this.http.post(url, payload).subscribe({
      next: (res: any) => {
        this.showAuthModal = true;
        this.resetSignupForm();
        this.isLogin = true;
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Ndodhi një gabim.';
        alert('Gabim: ' + errorMsg);
        this.showAuthModal = false;
      },
    });
  }

  resetSignupForm() {
    this.signupData = {
      name: '',
      surname: '',
      email: '',
      password: '',
      confirm: '',
    };
  }

  toggleForm(event: Event) {
    event.preventDefault();
    this.isLogin = !this.isLogin;
    this.successMsg = null;
  }

  closeModal() {
    this.showAuthModal = false;
  }
}
