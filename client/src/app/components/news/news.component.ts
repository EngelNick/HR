import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { NewsService } from 'app/services/news.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  admin = false;
  loadingNews = false;
  username;
  newsPosts;
  newsArray = [];
  newsCount;
  count;
  countArray = [];
  currentId;

  constructor(
    private authService: AuthService,
    private newsService: NewsService,
    private activatedRoute: ActivatedRoute
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

    this.activatedRoute.params.subscribe(
      params => {
        if (isNaN(params['id'])) {
          this.currentId = 1;
        } else {
          this.currentId = +params['id'];
        }
      });


    this.getAllNews();
    this.loadingNews = true;
  }

  refreshNews() {
    this.loadingNews = false;
    this.getAllNews();
    setTimeout(() => {
      this.loadingNews = true;
    }, 2000);
  }

  // getTwelveNews() {

  // }

  getAllNews() {
    this.newsArray = [];
    this.countArray = [];
    this.newsService.getAllNews().subscribe(data => {
      this.newsPosts = data.news;
      this.newsCount = this.newsPosts.length;
      this.count = Math.ceil(this.newsCount / 12);
      let s;
      for (let i = 1; i <= this.count; i++) {
        if (i === 1 && this.newsCount === 13) {
          s = this.newsCount - 1
        } else {
          s = this.newsCount;
        }
        for (let k = (i - 1) * 12; k < s; k++) {
          this.newsArray.push({ number: i, post: this.newsPosts[k] });
        }
      }
      for (let i = 1; i <= this.count; i++) {
        this.countArray.push(i);
      }
    });
  }
}
