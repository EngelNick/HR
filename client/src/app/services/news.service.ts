import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class NewsService {

  options;
  domain = this.authService.domain;
  newsPosts;
  loadingNews;
  newsArray;
  countArray;
  loadingTwelveNews;
  news;

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
    this.http.get(this.domain + '/savenews/allnews/').map(res => res.json()).subscribe(data => {
      if (this.newsPosts !== data.news) {
        this.loadingNews = false;
        this.newsArray = [];
        this.countArray = [];
        this.newsPosts = data.news;
        const newsCount = this.newsPosts.length;
        let count;
        count = Math.ceil(newsCount / 12);
        let s;
        for (let i = 1; i <= count; i++) {
          if (i === 1 && newsCount === 13) {
            s = newsCount - 1
          } else {
            s = newsCount;
          }
          for (let k = (i - 1) * 12; k < s; k++) {
            this.newsArray.push({ number: i, post: this.newsPosts[k] });
          }
        }
        for (let i = 1; i <= count; i++) {
          this.countArray.push(i);
        }
        this.loadingNews = true;
      } else {
        this.loadingNews = true;
      }
    });
  }

  getTwelveNews(id) {
    this.http.get(this.domain + '/savenews/getTwelveNews/' + id).map(res => res.json()).subscribe(data =>{
      if (this.news !== data.news) {
        this.loadingTwelveNews = false;
        this.news = data.news;
        this.loadingTwelveNews = true
      } else {
        this.loadingTwelveNews = true;
      }
    });
  }

  getSingleNews(id) {
    return this.http.get(this.domain + '/savenews/singleNews/' + id).map(res => res.json());
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
