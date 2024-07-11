import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../_services/auth/auth.service';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';


@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent {
  toastr = inject(ToastrService);
  router = inject(Router);
  restService = inject(RestBackendService);
  authService = inject(AuthService);
  comments: any[] = [];
  newComment: string = '';
  submitted = false;
  ideaId: number | undefined;

  constructor(private route: ActivatedRoute) { }

  
  ngOnInit() {
    this.ideaId = +this.route.snapshot.paramMap.get('id')!;
    //+ -> operatore unario che serve  aconvertire la stringa in numero
    //! -> indica che si è sicuri che il parametro esista e non sarà null.
    this.loadComments();
  }

  
  loadComments() {
    this.restService.getComments(this.ideaId).subscribe(comments => {
      this.comments = comments;
    });
  }

  commentForm = new FormGroup({
    content: new FormControl('', [
      Validators.required, 
      Validators.maxLength(200)
    ])
  });
  

  onSubmit(): void {
    this.submitted = true;
    if (this.commentForm.invalid) {
      this.toastr.error("Compila correttamente tutti i campi!");
    } else {
      this.restService.addComment({
        content: this.commentForm.value.content as string,
        ideaId: this.ideaId
      }).subscribe({
        next: (response) => {
          console.log('Idea created:', response);
          this.toastr.success("Commento creato con successo!");
          this.router.navigateByUrl("/ideas");
        },
        error: (err) => {
          console.error('Error creating comment:', err);
          this.toastr.error("Errore nella creazione del commento. Riprova!");
        }
      });
    }
  }

}
