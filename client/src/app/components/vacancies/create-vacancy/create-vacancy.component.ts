import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "app/services/auth.service";
import { VacanciesService } from "app/services/vacancies.service";

@Component({
  selector: 'app-create-vacancy',
  templateUrl: './create-vacancy.component.html',
  styleUrls: ['./create-vacancy.component.css']
})
export class CreateVacancyComponent implements OnInit {

  message;
  messageClass
  form;
  processing = false;
  vacancy;
  username;
  
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private vacanciesService: VacanciesService,
    private router: Router,
    private location: Location
  ) {
    this.createNewVacancyForm();
  }

  ngOnInit() {
    this.authService.isAdmin().subscribe(data => {
      if (!data.user.admin) {
        this.message = 'Извините, но у Вас не права доступа на администрирования сайта';
        this.messageClass = "alert alert-danger";
        this.router.navigate(['/vacancies']);
      } else {
        this.authService.getProfile().subscribe(profile => {
          if (profile.success) {
            this.username = profile.user.username;
          }
        });
      }
    });
  }

  createNewVacancyForm() {
    this.form = this.fb.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ])],
      url: ['', Validators.compose([
        Validators.maxLength(250)
      ])],
      hat: ['', Validators.compose([
        Validators.required,
        Validators.minLength(100),
        Validators.maxLength(250)
      ])],
      hot: 'true'
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

  onBodyTextEditorKeyUp(textValue) {
    this.form.body = textValue;
  }

  onCreateSubmit() {
    this.processing = true;
    this.disableFormVacancyForm();

     const vacancy = {
       title: this.form.get('title').value,
       url: this.form.get('url').value,
       hat: this.form.get('hat').value,
       hot: this.form.get('hot').value,
       body: this.form.body,
       createdBy: this.username
     }
    
    this.vacanciesService.newVacancy(vacancy).subscribe(data => {
      if(!data.success) {
        this.messageClass = "alert alert-danger";
        this.message = data.message;
        this.processing = false;
        this.enableFormVacancyForm();
      } else {
        this.messageClass = "alert alert-success";
        this.message = data.message;
        setTimeout(() => {
          this.processing = false;
          this.message = "";
          this.form.reset();
          this.router.navigate(['/news']);
          this.enableFormVacancyForm();
        }, 2000);
      }
    });
 }

  goBack() {
    this.location.back();
  }
}
