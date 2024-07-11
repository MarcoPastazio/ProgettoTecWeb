import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, RouterOutlet],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  title='HIVEMIND';
  toastr = inject(ToastrService);
  router = inject(Router);
  restService = inject(RestBackendService);
  submitted = false;
  signupForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required, 
      Validators.minLength(4), 
      Validators.maxLength(16)])
  })
  
  handleSignup() {
    console.log("Signup");
    this.submitted = true;
    if(this.signupForm.invalid){
      this.toastr.error("Registrazione non valida!");
    } else {
      this.restService.signup({
        username: this.signupForm.value.username as string,
        password: this.signupForm.value.password as string,
      }).subscribe({
        error: (err) => {
          this.toastr.error("username già esistente");
        },
        complete: () => {
          this.toastr.success(`È andato a buon fine`,`Congratulazioni ${this.signupForm.value.username}!`);
          this.router.navigateByUrl("/auth");
        }
      })
    }
  }
}
