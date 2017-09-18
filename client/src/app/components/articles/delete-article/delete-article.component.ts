import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ArticlesService } from 'app/services/articles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-delete-article',
  templateUrl: './delete-article.component.html',
  styleUrls: ['./delete-article.component.css']
})
export class DeleteArticleComponent implements OnInit {

  message;
  messageClass;
  foundArticle = false;
  processing = false;
  article;
  currentUrl;

  constructor(
    private articlesService: ArticlesService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.isAdmin().subscribe(data => {
      if (data.user.admin) {
        this.currentUrl = this.activatedRoute.snapshot.params;
        this.articlesService.getSingleArticle(this.currentUrl.id).subscribe(artData => {
          if (!artData.success) {
            this.messageClass = 'alert alert-danger';
            this.message = artData.message;
          } else {
            this.article = {
              title: artData.article.title,
              hat: artData.article.hat,
              createdBy: artData.article.createdBy,
              createdAt: artData.article.createdAt
            }
            this.foundArticle = true;
          }
        });
      } else {
        this.message = 'Извините, но у Вас не права доступа на администрирования сайта';
        this.messageClass = 'alert alert-danger';
        this.router.navigate(['/articles']);
      }
    });
  }

  deleteArticle() {
    this.articlesService.deleteArticle(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.processing = true;
        setTimeout(() => {
          this.router.navigate(['/articles']);
        }, 2000);
      }
    })
  }

}
