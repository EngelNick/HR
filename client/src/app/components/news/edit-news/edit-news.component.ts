import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NewsService } from 'app/services/news.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-edit-news',
  templateUrl: './edit-news.component.html',
  styleUrls: ['./edit-news.component.css']
})
export class EditNewsComponent implements OnInit {

  message;
  messageClass;
  processing = false;
  currentUrl;
  loading = true;
  news;
  form;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private newsService: NewsService,
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.authService.isAdmin().subscribe(data => {
      if (data.user.admin) {
        this.currentUrl = this.activatedRoute.snapshot.params;
        this.newsService.getSingleNews(this.currentUrl.id).subscribe(newsdata => {
          if (!newsdata.success) {
            this.message = newsdata.message;
            this.messageClass = 'alert alert-danger';
          } else {
            this.news = newsdata.news;
            this.createNewsEditForm();
            this.loading = false;
            this.message = newsdata.message;
            this.messageClass = 'alert alert-success';
          }
        });
      } else {
        this.message = 'Извините, но у Вас не права доступа на администрирования сайта';
        this.messageClass = 'alert alert-danger';
        this.router.navigate(['/news']);
      }
    });

  }

  createNewsEditForm() {
    this.form = this.fb.group({
      title: [this.news.title, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ])],
      url: [this.news.url, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(250)
      ])],
      hat: [this.news.hat, Validators.compose([
        Validators.required,
        Validators.minLength(100),
        Validators.maxLength(250)
      ])]
    });
  }

  updateNewsSubmit() {
    this.processing = true;
    this.news.title = this.form.get('title').value;
    this.news.url = this.form.get('url').value;
    this.news.hat = this.form.get('hat').value;
    this.disableFormNewsForm();
    this.imageBodyCorrector();
    this.newsService.editNews(this.news).subscribe(data => {
      if (!data.success) {
        this.message = data.message;
        this.messageClass = 'alert alert-danger';
        this.processing = false;
        this.enableFormNewsForm();
      } else {
        this.message = data.message;
        this.messageClass = 'alert alert-success';
        setTimeout(() => {
          this.router.navigate(['/full-news/' + this.currentUrl.id]);
        }, 2000);
      }
    });
  }

  enableFormNewsForm() {
    this.form.get('title').enable();
    this.form.get('url').enable();
    this.form.get('hat').enable();
  }

  disableFormNewsForm() {
    this.form.get('title').disable();
    this.form.get('url').disable();
    this.form.get('hat').disable();
  }

  onBodyEditorKeyUp(text) {
    this.news.body = text;
  }

  goBack() {
    this.location.back();
  }

  imageBodyCorrector() {
    let str = '';
    if (this.news.body.indexOf('<img style="') >= 0 && this.news.body.indexOf('<img style="max') <= 0) {
      str = this.news.body.substring( 0, this.news.body.indexOf('<img style="') + 12) +
      'max-width: 100%; height: auto;' + this.news.body.substring(this.news.body.indexOf('<img style="') + 12);
      this.news.body = str;
    }
  }
}
