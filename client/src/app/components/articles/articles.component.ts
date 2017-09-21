import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { NewsService } from 'app/services/news.service';
import { ArticlesService } from 'app/services/articles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs/observable/interval';

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
  countArray;
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
    return !this.articlesArray && !this.news;
  }

  // getAllArticles() {
  //   this.articlesService.getAllArticles().subscribe(data => {
  //     if (this.articlesPosts !== data.articles) {
  //     this.articlesArray = [];
  //     this.countArray = [];
  //     this.articlesPosts = data.articles;
  //     const articlesCount = this.articlesPosts.length;
  //     let count;
  //     count = Math.ceil(articlesCount / 12);
  //     let s;
  //     for (let i = 1; i <= count; i++) {
  //       if (i === 1 && articlesCount === 13) {
  //         s = articlesCount - 1;
  //       } else {
  //         s = articlesCount;
  //       }
  //       for (let k = (i - 1) * 12; k < s; k++) {
  //         this.articlesArray.push({ number: i, post: this.articlesPosts[k] });
  //       }
  //     }
  //     for (let i = 1; i <= count; i++) {
  //       this.countArray.push(i);
  //     }
  //     this.articlesService.loadingArticles = true;
  //   } else {
  //     this.articlesService.loadingArticles = true;
  //   }
  //   });
  // }

  getAllArticles() {
    this.articlesService.getAllArticles();
  }

  getDataFromService() {
    this.articlesPosts = this.articlesService.articlesPosts;
    this.articlesArray = this.articlesService.articlesArray;
    this.countArray = this.articlesService.countArray;
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