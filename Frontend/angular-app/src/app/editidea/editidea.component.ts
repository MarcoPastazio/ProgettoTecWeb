import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../_services/auth/auth.service';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
// import { MarkdownComponent } from 'ngx-markdown';


@Component({
  selector: 'app-editidea',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterOutlet/*, MarkdownComponent*/],  
  templateUrl: './editidea.component.html',
  styleUrls: ['./editidea.component.scss']
})
export class EditideaComponent {
  title = 'HIVEMIND';
  toastr = inject(ToastrService);
  router = inject(Router);
  restService = inject(RestBackendService);
  authService = inject(AuthService);
  submitted = false;

  ideaForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [
      Validators.required, 
      Validators.maxLength(400)
    ])
  });


  onSubmit(): void {
    this.submitted = true;
    if (this.ideaForm.invalid) {
      this.toastr.error("Compila correttamente tutti i campi!");
    } else {
      this.restService.createIdea({
        title: this.ideaForm.value.title as string,
        description: this.ideaForm.value.description as string,
      }).subscribe({
        next: (response) => {
          console.log('Idea creata:', response);
          this.toastr.success("Idea creata con successo!");
          this.router.navigateByUrl("/ideas");
        },
        error: (err) => {
          console.error('Errore nella creazione dell\'idea:', err);
          this.toastr.error("Errore nella creazione dell'idea. Riprova!");
        }
      });
    }
  }
}

