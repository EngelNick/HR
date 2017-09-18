import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class ArticlesService {
  options;
  domain = this.authService.domain;

  constructor(
    private authService: AuthService,
    private http: Http
  ) { }

    createAuthenticationHeaders() {
    this.authService.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authService.authToken
      })
    });
  }

  newArticle(article) {
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + '/articles/newArticle/', article, this.options).map(res => res.json());
  }

  getAllArticles() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/articles/allArticles/', this.options).map(res => res.json());
  }

  getSingleArticle(id) {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/articles/singleArticle/' + id, this.options).map(res => res.json());
  }

  editArticle(article) {
    this.createAuthenticationHeaders();
    return this.http.put(this.domain + '/articles/updateArticle/', article , this.options).map(res => res.json());
  }

  deleteArticle(id) {
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + '/articles/deleteArticle/' + id, this.options).map(res => res.json());
  }

}
