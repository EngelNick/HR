import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NewsService } from 'app/services/news.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.css']
})
export class CreateNewsComponent implements OnInit {

  message;
  messageClass
  form;
  processing = false;
  news;
  username

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private newsService: NewsService,
    private router: Router,
    private location: Location
  ) {
    this.createNewNewsForm();
  }

  ngOnInit() {
    this.authService.isAdmin().subscribe(data => {
      if (!data.user.admin) {
        this.message = 'Извините, но у Вас не права доступа на администрирования сайта';
        this.messageClass = 'alert alert-danger';
        this.router.navigate(['/news']);
      } else {
        this.authService.getProfile().subscribe(profile => {
          if (profile.success) {
            this.username = profile.user.username;
          }
        });
      }
    });
  }

  createNewNewsForm() {
    this.form = this.fb.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ])],
      url: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(250)
      ])],
      hat: ['', Validators.compose([
        Validators.required,
        Validators.minLength(100),
        Validators.maxLength(250)
      ])]
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

  onBodyTextEditorKeyUp(textValue) {
    this.form.body = textValue;
  }

  onCreateSubmit() {
    this.processing = true;
    this.disableFormNewsForm();

    const news = {
      title: this.form.get('title').value,
      url: this.form.get('url').value,
      hat: this.form.get('hat').value,
      body: this.form.body,
      createdBy: this.username
    }

    this.newsService.newNews(news).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableFormNewsForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this.processing = false;
          this.message = '';
          this.form.reset();
          this.router.navigate(['/news']);
          this.enableFormNewsForm();
        }, 2000);
      }
    });
  }

  goBack() {
    this.location.back();
  }

}
