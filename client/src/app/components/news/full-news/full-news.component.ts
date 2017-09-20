import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { NewsService } from 'app/services/news.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeHtmlPipe } from 'app/pipes/safeHtml.pipe';

@Component({
  selector: 'app-full-news',
  templateUrl: './full-news.component.html',
  styleUrls: ['./full-news.component.css']
})
export class FullNewsComponent implements OnInit {
  currentUrl;
  admin = false;
  message;
  messageClass
  username;
  news;
  loading = true;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private newsService: NewsService
  ) {

  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      if (profile.success) {
        this.username = profile.user.username;
      }
    });

    this.authService.isAdmin().subscribe(data => {
      if (data.success) {
        this.admin = data.user.admin;
      }
    });

    this.getSingleNewsItem();
  }

  getSingleNewsItem() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.newsService.getSingleNews(this.currentUrl.id).subscribe(data => {
      if (data.success && this.news !== data.news) {
        this.news = [];
        this.news = data.news;
        this.loading = false;
        this.message = data.message;
        this.messageClass = 'alert alert-success';
      } else {
        this.message = data.message;
        this.messageClass = 'alert alert-danger';
      }
    });
  }

  likeNews(id) {
    this.authService.likeNews(id).subscribe(data => {
      this.getSingleNewsItem();
    });
  }
}
