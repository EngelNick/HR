import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ArticlesService } from 'app/services/articles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.css']
})
export class EditArticleComponent implements OnInit {

  message;
  messageClass;
  processing = false;
  currentUrl;
  loading = true;
  article;
  form;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private articlesService: ArticlesService,
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.authService.isAdmin().subscribe(data => {
      if (data.user.admin) {
        this.currentUrl = this.activatedRoute.snapshot.params;
        this.articlesService.getSingleArticle(this.currentUrl.id).subscribe(artdata => {
          if (!artdata.success) {
            this.message = artdata.message;
            this.messageClass = 'alert alert-danger';
          } else {
            this.article = artdata.article;
            this.createArticleEditForm();
            this.loading = false;
            this.message = artdata.message;
            this.messageClass = 'alert alert-success';
          }
        });
      } else {
        this.message = 'Извините, но у Вас не права доступа на администрирования сайта';
        this.messageClass = 'alert alert-danger';
        this.router.navigate(['/articles']);
      }
    });

  }

  createArticleEditForm() {
    this.form = this.fb.group({
      title: [this.article.title, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ])]
    });
  }

  updateArticleSubmit() {
    this.processing = true;
    this.article.title = this.form.get('title').value;
    this.imageBodyCorrector();
    this.disableFormArticleForm();
    this.articlesService.editArticle(this.article).subscribe(data => {
      if (!data.success) {
        this.message = data.message;
        this.messageClass = 'alert alert-danger';
        this.processing = false;
        this.enableFormArticleForm();
      } else {
        this.message = data.message;
        this.messageClass = 'alert alert-success';
        setTimeout(() => {
          this.router.navigate(['/full-article/' + this.currentUrl.id]);
        }, 2000);
      }
    });
  }

  enableFormArticleForm() {
    this.form.get('title').enable();
  }

  disableFormArticleForm() {
    this.form.get('title').disable();
  }

  onBodyEditorKeyUp(text) {
    this.article.body = text;
  }

  goBack() {
    this.location.back();
  }

  imageBodyCorrector() {
    let str = '';
    if (this.article.body.indexOf('<img style="') || this.article.body.indexOf('<img style="max') <= 0) {
      str = this.article.body.substring( 0, this.article.body.indexOf('<img style="') + 12) +
      'max-width: 100%; height: auto;' + this.article.body.substring(this.article.body.indexOf('<img style="') + 12);
      this.article.body = str;
    }
  }

}
