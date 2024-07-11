import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRequest } from './auth-request.type';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestBackendService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  login(loginRequest: AuthRequest): Observable<string> {
    const url = `${this.baseUrl}/auth`;
    return this.http.post<string>(url, loginRequest, this.httpOptions);
  }
  
  signup(signupRequest: AuthRequest): Observable<any> {
    const url = `${this.baseUrl}/signup`;
    return this.http.post(url, signupRequest, this.httpOptions);
  }
 
  getAllIdeas(offset: number): Observable<any> {
    const url = `${this.baseUrl}/ideas?offset=${offset}`;
    return this.http.get(url, this.httpOptions);
  }
  
  getControversialIdeas(offset: number): Observable<any> {
    const url = `${this.baseUrl}/ideas/controversial?offset=${offset}`;
    return this.http.get(url, this.httpOptions);
  }
  
  getUnpopularIdeas(offset: number): Observable<any> {
    const url = `${this.baseUrl}/ideas/unpopular?offset=${offset}`;
    return this.http.get(url, this.httpOptions);
  }
  
  getMainstreamIdeas(offset: number): Observable<any> {
    const url = `${this.baseUrl}/ideas/mainstream?offset=${offset}`;
    return this.http.get(url, this.httpOptions);
  }

  
  createIdea(ideaData: any): Observable<any> {
    const url = `${this.baseUrl}/editidea`;
    return this.http.post(url, ideaData, this.httpOptions);
  }

  voteIdea(ideaId: number, type: 'like' | 'dislike'): Observable<any> {
    const url = `${this.baseUrl}/ideas/${ideaId}/vote`;
    return this.http.post(url, { type }, this.httpOptions);
  }
  
  
  updateIdea(id: number, ideaData: any): Observable<any> {
    const url = `${this.baseUrl}/ideas/${id}`;
    return this.http.put(url, ideaData, this.httpOptions);
  }

  deleteIdea(id: number): Observable<any> {
    const url = `${this.baseUrl}/ideas/${id}`;
    return this.http.delete(url, this.httpOptions);
  }
  
  getComments(ideaId: any): Observable<any[]> {
    const url = `${this.baseUrl}/comments/${ideaId}`;
    return this.http.get<any[]>(url, this.httpOptions);
  }
  
  addComment(commento: any): Observable<any> {
    const url = `${this.baseUrl}/comments`;
    return this.http.post(url, { commento }, this.httpOptions);
  }

  countIdeas(): Observable<any> {
    const url = `${this.baseUrl}/count`;
    return this.http.get<any>(url, this.httpOptions);
  }
}


