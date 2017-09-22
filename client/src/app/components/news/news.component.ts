import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { NewsService } from 'app/services/news.service';
import { ActivatedRoute } from '@angular/router';
import { interval } from 'rxjs/observable/interval';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  admin = false;
  loadingNews;
  newsPosts;
  newsArray;
  countArray;
  currentId;
  // count;
  // username;
  // newsCount;

  constructor(
    private authService: AuthService,
    private newsService: NewsService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    // if (this.username === undefined) {
    //   this.authService.getProfile().subscribe(profile => {
    //     if (profile.success) {
    //       this.username = profile.user.username;
    //     }
    //   });
    // }

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
      this.getAllNews();
      if (!this.newsService.loadingNews) {
        interval(25)
        .takeWhile(() => this.check())
        .subscribe(() => {
          this.getDataFromService();
        })
      } else {
        this.getDataFromService();
      }
  }

  check() {
    return !this.newsArray;
  }

  refreshNews() {
    this.newsService.loadingNews = false;
    this.getAllNews();
    setTimeout(() => {
      this.getDataFromService();
      this.newsService.loadingNews = true;
    }, 2000);
  }

  // getTwelveNews() {

  // }

  // 1getAllNews() {
  //   this.newsService.getAllNews().subscribe(data => {
  //     if (this.newsPosts !== data.news) {
  //       this.loadingNews = false;
  //       this.newsArray = [];
  //       this.countArray = [];
  //       this.newsPosts = data.news;
  //       this.newsCount = this.newsPosts.length;
  //       this.count = Math.ceil(this.newsCount / 12);
  //       let s;
  //       for (let i = 1; i <= this.count; i++) {
  //         if (i === 1 && this.newsCount === 13) {
  //           s = this.newsCount - 1
  //         } else {
  //           s = this.newsCount;
  //         }
  //         for (let k = (i - 1) * 12; k < s; k++) {
  //           this.newsArray.push({ number: i, post: this.newsPosts[k] });
  //         }
  //       }
  //       for (let i = 1; i <= this.count; i++) {
  //         this.countArray.push(i);
  //       }
  //       this.loadingNews = true;
  //     } else {
  //       this.loadingNews = true;
  //     }
  //   });
  // }

  getAllNews() {
    this.newsService.getAllNews();
  }


  getDataFromService() {
    this.newsPosts = this.newsService.newsPosts;
    this.newsArray = this.newsService.newsArray;
    this.countArray = this.newsService.countArray;
    this.loadingNews = this.newsService.loadingNews;
  }

}
