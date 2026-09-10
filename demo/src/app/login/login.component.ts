import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { SoralyxLogoComponent } from '../shared/logo.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, SoralyxLogoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username = 'admin';
  password = '';
  showPass = signal(false);
  error = signal('');
  loading = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error.set('');
    if (!this.username || !this.password) {
      this.error.set('Enter your username and password.');
      return;
    }
    this.loading.set(true);
    // simulate a brief auth round-trip
    setTimeout(() => {
      const ok = this.auth.login(this.username, this.password);
      this.loading.set(false);
      if (ok) {
        this.router.navigateByUrl('/quotes');
      } else {
        this.error.set('Incorrect username or password.');
      }
    }, 350);
  }
}
