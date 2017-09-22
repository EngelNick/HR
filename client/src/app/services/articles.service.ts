import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ArticlesService {
  options;
  domain = this.authService.domain;
  loadingArticles;
  articlesPosts;
  articlesArray;
  countArray;

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
    this.http.get(this.domain + '/articles/allArticles/').map(res => res.json()).subscribe(data => {
      if (this.articlesPosts !== data.articles) {
        this.loadingArticles = false;
        this.articlesArray = [];
        this.countArray = [];
        this.articlesPosts = data.articles;
        const articlesCount = this.articlesPosts.length;
        let count;
        count = Math.ceil(articlesCount / 12);
        let s;
        for (let i = 1; i <= count; i++) {
          if (i === 1 && articlesCount === 13) {
            s = articlesCount - 1;
          } else {
            s = articlesCount;
          }
          for (let k = (i - 1) * 12; k < s; k++) {
            this.articlesArray.push({ number: i, post: this.articlesPosts[k] });
          }
        }
        for (let i = 1; i <= count; i++) {
          this.countArray.push(i);
        }
        this.loadingArticles = true;
      } else {
        this.loadingArticles = true;
      }
    })
  }

  getSingleArticle(id) {
    return this.http.get(this.domain + '/articles/singleArticle/' + id).map(res => res.json());
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
