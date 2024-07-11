import { Component, inject } from '@angular/core';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-ideas',
  standalone: true,
  imports: [RouterLink, MarkdownComponent],
  templateUrl: './ideas.component.html',
  styleUrls: ['./ideas.component.scss']
})
export class IdeasComponent {
  restService = inject(RestBackendService);
  toastr = inject(ToastrService);
  router = inject(Router);
  ideas: any[] = [];
  currentCriteria: string = 'all';
  offset: number = 0;
  limit: number = 10;
  totalIdeas: number = 0;

  ngOnInit() {
    this.fetchIdeasByCriteria(this.currentCriteria);
    this.fetchTotalIdeas();
  }

  fetchTotalIdeas() {
    this.restService.countIdeas().subscribe({
      next: (countData) => {
        this.totalIdeas = countData.totalCount;
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  loadMore() {
    if (this.offset + this.limit < this.totalIdeas) {
      this.offset += this.limit;
      this.fetchIdeasByCriteria(this.currentCriteria);
    } else {
      this.toastr.warning('Non ci sono altre idee da caricare.');
    }
  }

  fetchIdeasByCriteria(criteria: string) {
    let fetchIdeas;
    switch (criteria) {
      case 'controversial':
        fetchIdeas = this.restService.getControversialIdeas(this.offset);
        break;
      case 'unpopular':
        fetchIdeas = this.restService.getUnpopularIdeas(this.offset);
        break;
      case 'mainstream':
        fetchIdeas = this.restService.getMainstreamIdeas(this.offset);
        break;
      default:
        fetchIdeas = this.restService.getAllIdeas(this.offset);
    }

    fetchIdeas.subscribe({
      next: (data) => {
        console.log(data);
        this.ideas = data;
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  changeCriteria(criteria: string) {
    this.currentCriteria = criteria;
    this.offset = 0;
    this.fetchIdeasByCriteria(criteria);
  }

  comeBack() {
    if(this.offset > 0){
      this.offset -= this.limit;
      this.fetchIdeasByCriteria(this.currentCriteria);
    }else{
      this.toastr.error("Non puoi farlo");
    }
  }

  handleError(err: any) {
    if (err.status === 401) {
      this.toastr.error("Il token di accesso non è valido. Riaccedi", "Token scaduto");
      this.router.navigateByUrl("/auth");
    } else {
      this.toastr.error(err.message, err.statusText);
    }
  }

  handleVote(ideaId: number, type: 'like' | 'dislike') {
    this.restService.voteIdea(ideaId, type).subscribe({
      next: () => {
        this.toastr.success("Voto registrato!", "Votato");
        this.fetchIdeasByCriteria(this.currentCriteria);
      },
      error: (err) => {
        this.toastr.error("Impossibile registrare il voto.", "Hai già votato!");
      }
    });
  }

  handleDelete(id: number) {
    this.restService.deleteIdea(id).subscribe({
      next: () => {
        this.toastr.success("Idea cancellata!", "Fatto");
        this.ideas = this.ideas.filter((x) => x.id !== id);
        this.fetchIdeasByCriteria(this.currentCriteria);
      },
      error: (err) => {
        this.toastr.error("Impossibile cancellare l'idea.", "Oops! Qualcosa è andato storto.");
      }
    });
  }

  showComment(ideaId: number) {
    this.router.navigate(['/comments', ideaId]);
  }

  logout() {
    this.router.navigate(['/logout']);
  }
}
