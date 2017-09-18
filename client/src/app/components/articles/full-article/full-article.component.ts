import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { ArticlesService } from 'app/services/articles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeHtmlPipe } from 'app/pipes/safeHtml.pipe';

@Component({
  selector: 'app-full-article',
  templateUrl: './full-article.component.html',
  styleUrls: ['./full-article.component.css']
})
export class FullArticleComponent implements OnInit {
  currentUrl;
  admin = false;
  message;
  messageClass
  username;
  article;
  loading = true;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private articlesService: ArticlesService
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

    this.getSingleArticleItem();
  }

  getSingleArticleItem() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.articlesService.getSingleArticle(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        this.message = data.message;
        this.messageClass = 'alert alert-danger';
      } else {
        this.article = data.article;
        this.loading = false;
        this.message = data.message;
        this.messageClass = 'alert alert-success';
      }
    });
  }

  likeArticle(id) {
    this.authService.likeArticle(id).subscribe(data => {
      this.getSingleArticleItem();
    });
  }
}
