import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { NewsService } from 'app/services/news.service';
import { ArticlesService } from 'app/services/articles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs/observable/interval';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

  admin = false;
  loadingArticles;
  articlesPosts;
  articlesArray;
  countArrayArticles;
  currentId;
  news;
  loadingTwelveNews;
  // articlesCount;
  // count;
  // username;
  // message;
  // messageClass;

  constructor(
    private articlesService: ArticlesService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private newsService: NewsService
  ) { }

  ngOnInit() {
    if (!this.admin) {
      this.authService.isAdmin().subscribe(data => {
        if (data.success) {
          this.admin = data.user.admin;
        } else {
        }
      });
    }
    this.activatedRoute.params.subscribe(
      params => {
        if (isNaN(params['id'])) {
          this.currentId = 1;
        } else {
          this.currentId = +params['id'];
        }
      });

    this.getAllArticles();
    this.getTwelveNews();
    if (!this.articlesService.loadingArticles || !this.newsService.loadingTwelveNews) {
      interval(25)
        .takeWhile(() => this.check())
        .subscribe(() => {
          this.getDataFromService();
          this.getDataFromNewsService();
        })
    } else {
      this.getDataFromService();
      this.getDataFromNewsService();
    }
  }

  check() {
    if (!this.articlesArray) {
      return true;
    } else if (!this.news) {
      return true;
    }
    return false;
  }

  getAllArticles() {
    this.articlesService.getAllArticles();
  }

  getDataFromService() {
    this.articlesPosts = this.articlesService.articlesPosts;
    this.articlesArray = this.articlesService.articlesArray;
    this.countArrayArticles = this.articlesService.countArrayArticles;
    this.loadingArticles = this.articlesService.loadingArticles;
  }

  getDataFromNewsService() {
    this.loadingTwelveNews = this.newsService.loadingTwelveNews;
    this.news = this.newsService.news;
  }

  refreshArticles() {
    this.articlesService.loadingArticles = false;
    this.getAllArticles();
    this.getTwelveNews();
    setTimeout(() => {
      this.getDataFromService();
      this.getDataFromNewsService();
      this.articlesService.loadingArticles = false;
    }, 2000);
  }

  getTwelveNews() {
    this.newsService.getTwelveNews(1);
  }

  redirect(id) {
    this.router.navigate(['/full-news/', id]);
  }

}
