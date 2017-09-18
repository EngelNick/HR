import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { NewsService } from 'app/services/news.service';
import { ArticlesService } from 'app/services/articles.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

  admin = false;
  loadingArticles = false;
  loadingNews = false;
  username;
  articlesPosts;
  articlesArray = [];
  articlesCount;
  count;
  countArray = [];
  currentId;
  message;
  messageClass;
  news = [];

  constructor(
    private articlesService: ArticlesService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private newsService: NewsService
  ) { }

  ngOnInit() {
    this.authService.isAdmin().subscribe(data => {
      if (data.success) {
        this.admin = data.user.admin;
      }
    });
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
    this.loadingArticles = true;
    this.loadingNews = true;
  }

  getAllArticles() {
    this.articlesArray = [];
    this.countArray = [];
    this.articlesService.getAllArticles().subscribe(data => {
      this.articlesPosts = data.articles;
      this.articlesCount = this.articlesPosts.length;
      this.count = Math.ceil(this.articlesCount / 12);
      let s;
      for (let i = 1; i <= this.count; i++) {
        if (i === 1 && this.articlesCount === 13) {
          s = this.articlesCount - 1;
        } else {
          s = this.articlesCount;
        }
        for (let k = (i - 1) * 12; k < s; k++) {
          this.articlesArray.push({ number: i, post: this.articlesPosts[k] });
        }
      }
      for (let i = 1; i <= this.count; i++) {
        this.countArray.push(i);
      }
    });
  }

  getTwelveNews() {
    this.newsService.getTwelveNews(1).subscribe(data => {
        if (!data.success) {
          this.message = data.message;
          this.messageClass = 'alert alert-danger';
        } else {
          this.news = data.news;
          this.message = data.message;
          this.messageClass = 'alert alert-success';
        }
      });
  }

  refreshArticles() {
    this.loadingArticles = false;
    this.getAllArticles();
    setTimeout(() => {
      this.loadingArticles = true;
    }, 2000);
  }

}
