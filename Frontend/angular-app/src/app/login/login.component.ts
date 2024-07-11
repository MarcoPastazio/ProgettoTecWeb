import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../_services/auth/auth.service';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  title = 'HIVEMIND';
  toastr = inject(ToastrService);
  router = inject(Router);
  restService = inject(RestBackendService);
  authService = inject(AuthService);
  submitted = false;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required, 
      Validators.minLength(4), 
      Validators.maxLength(16)
    ])
  });

  handleLogin(){
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.toastr.error("username o password errati!");
    } else {
      this.restService.login({
        username: this.loginForm.value.username as string,
        password: this.loginForm.value.password as string,
      }).subscribe({
        next: (token) => {
          console.log('Token ricevuto:', token);
          this.authService.updateToken(token);
          this.toastr.success(`Benvenuto ${this.loginForm.value.username}!`);
          this.router.navigateByUrl("/ideas");
        },
        error: (err) => {
          console.error('Errore durante il login:', err);
          this.toastr.error("Riprovare!");
        }
      });
    }
  }
}
