import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ArticlesService } from 'app/services/articles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css']
})
export class CreateArticleComponent implements OnInit {

  message;
  messageClass
  form;
  processing = false;
  article;
  username;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private articlesService: ArticlesService,
    private router: Router,
    private location: Location
  ) {
    this.createNewArticlesForm();
  }

  ngOnInit() {
    this.authService.isAdmin().subscribe(data => {
      if (!data.user.admin) {
        this.message = 'Извините, но у Вас не права доступа на администрирования сайта';
        this.messageClass = 'alert alert-danger';
        this.router.navigate(['/articles']);
      } else {
        this.authService.getProfile().subscribe(profile => {
          if (profile.success) {
            this.username = profile.user.username;
          }
        });
      }
    });
  }

  createNewArticlesForm() {
    this.form = this.fb.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ])]
    });
  }

  enableFormArticleForm() {
    this.form.get('title').enable();
  }

  disableFormArticleForm() {
    this.form.get('title').disable();
  }

  onBodyTextEditorKeyUp(textValue) {
    this.form.body = textValue;
  }

  onCreateSubmit() {
    this.processing = true;
    this.disableFormArticleForm();

    this.article = {
      title: this.form.get('title').value,
      body: this.form.body,
      createdBy: this.username
    }
    this.imageBodyCorrector();
    this.articlesService.newArticle(this.article).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableFormArticleForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.articlesService.getAllArticles();
        setTimeout(() => {
          this.processing = false;
          this.message = '';
          this.form.reset();
          this.router.navigate(['/articles']);
          this.enableFormArticleForm();
        }, 2000);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  imageBodyCorrector() {
    let str = '';
    if (this.article.body.indexOf('<img style="') >= 0 && this.article.body.indexOf('<img style="max') <= 0) {
      str = this.article.body.substring( 0, this.article.body.indexOf('<img style="') + 12) +
      'max-width: 100%; height: auto;' + this.article.body.substring(this.article.body.indexOf('<img style="') + 12);
      this.article.body = str;
    }
  }

}
