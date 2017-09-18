import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';


@Injectable()
export class NewsService {

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

  newNews(news) {
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + '/savenews/newnews/', news, this.options).map(res => res.json());
  }

  getAllNews() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/savenews/allnews/', this.options).map(res => res.json());
  }

  getTwelveNews(id) {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/savenews/getTwelveNews/' + id, this.options).map(res => res.json());
  }

  getSingleNews(id) {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/savenews/singleNews/' + id, this.options).map(res => res.json());
  }

  editNews(news) {
    this.createAuthenticationHeaders();
    return this.http.put(this.domain + '/savenews/updateNews/', news, this.options).map(res => res.json());
  }

  deleteNews(id) {
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + '/savenews/deleteNews/' + id, this.options).map(res => res.json());
  }

}
