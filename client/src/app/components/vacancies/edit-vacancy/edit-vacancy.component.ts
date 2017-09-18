import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { VacanciesService } from "app/services/vacancies.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "app/services/auth.service";


@Component({
  selector: 'app-edit-vacancy',
  templateUrl: './edit-vacancy.component.html',
  styleUrls: ['./edit-vacancy.component.css']
})
export class EditVacancyComponent implements OnInit {

  message;
  messageClass;
  processing = false;
  currentUrl;
  loading = true;
  vacancy;
  form;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private vacanciesService: VacanciesService,
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.authService.isAdmin().subscribe(data => {
      if (data.user.admin) {
        this.currentUrl = this.activatedRoute.snapshot.params;
        this.vacanciesService.getSingleVacancy(this.currentUrl.id).subscribe(data => {
          if(!data.success) {
            this.message = data.message;
            this.messageClass = "alert alert-danger";
          } else {
            this.vacancy = data.vacancy;
            this.createVacancyEditForm();
            this.loading = false;
            this.message = data.message;
            this.messageClass = "alert alert-success";
          }
        });
      } else {
        this.message = 'Извините, но у Вас не права доступа на администрирования сайта';
        this.messageClass = "alert alert-danger";
        this.router.navigate(['/vacancies']);
      }
    });
    
  }

  createVacancyEditForm() {
    this.form = this.fb.group({
      title: [this.vacancy.title, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ])],
      url: [this.vacancy.url, Validators.compose([
        Validators.maxLength(250)
      ])],
      hat: [this.vacancy.hat, Validators.compose([
        Validators.required,
        Validators.minLength(100),
        Validators.maxLength(250)
      ])],
      hot: this.vacancy.hot
    });
  }

  updateVacancySubmit() {
    this.processing = true;
    this.vacancy.title = this.form.get('title').value;
    this.vacancy.url = this.form.get('url').value;
    this.vacancy.hat = this.form.get('hat').value;
    this.vacancy.hot = this.form.get('hot').value;
    console.log(this.form.get('hot').value);
    this.disableFormVacancyForm();
    this.vacanciesService.editVacancy(this.vacancy).subscribe(data => {
      if(!data.success) {
        this.message = data.message;
        this.messageClass = "alert alert-danger";
        this.processing = false;
        this.enableFormVacancyForm();
      } else {
        this.message = data.message;
        this.messageClass = "alert alert-success";
        setTimeout(() => {
          this.router.navigate(['/full-vacancy/' + this.currentUrl.id]);
        }, 2000);
      }
    });
  }

  enableFormVacancyForm() {
    this.form.get('title').enable();
    this.form.get('url').enable();
    this.form.get('hat').enable();
    this.form.get('hot').enable();
  }

  disableFormVacancyForm() {
    this.form.get('title').disable();
    this.form.get('url').disable();
    this.form.get('hat').disable();
    this.form.get('hot').disable();
  }

  onBodyEditorKeyUp(text) {
    this.vacancy.body = text;
  }

  goBack() {
    this.location.back();
  }
}
