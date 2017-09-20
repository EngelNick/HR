import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NewsService } from 'app/services/news.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-delete-news',
  templateUrl: './delete-news.component.html',
  styleUrls: ['./delete-news.component.css']
})
export class DeleteNewsComponent implements OnInit {

  message;
  messageClass;
  foundNews = false;
  processing = false;
  news;
  currentUrl;

  constructor(
    private newsService: NewsService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.isAdmin().subscribe(data => {
      if (data.user.admin) {
        this.currentUrl = this.activatedRoute.snapshot.params;
        this.newsService.getSingleNews(this.currentUrl.id).subscribe(data => {
          if (!data.success) {
            this.messageClass = 'alert alert-danger';
            this.message = data.message;
          } else {
            this.news = {
              title: data.news.title,
              hat: data.news.hat,
              createdBy: data.news.createdBy,
              createdAt: data.news.createdAt
            }
            this.foundNews = true;
          }
        });
      } else {
        this.message = 'Извините, но у Вас не права доступа на администрирования сайта';
        this.messageClass = 'alert alert-danger';
        this.router.navigate(['/news']);
      }
    });
  }

  deleteNews() {
    this.newsService.deleteNews(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.processing = true;
        this.newsService.getAllNews();
        setTimeout(() => {
          this.router.navigate(['/news']);
        }, 2000);
      }
    })
  }

}
