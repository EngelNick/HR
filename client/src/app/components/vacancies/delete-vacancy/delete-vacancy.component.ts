import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { VacanciesService } from 'app/services/vacancies.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-delete-vacancy',
  templateUrl: './delete-vacancy.component.html',
  styleUrls: ['./delete-vacancy.component.css']
})
export class DeleteVacancyComponent implements OnInit {

  message;
  messageClass;
  foundVacancy = false;
  processing = false;
  vacancy;
  currentUrl;

  constructor(
    private vacanciesService: VacanciesService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.isAdmin().subscribe(data => {
      if (data.user.admin) {
        this.currentUrl = this.activatedRoute.snapshot.params;
        this.vacanciesService.getSingleVacancy(this.currentUrl.id).subscribe(data => {
          if (!data.success) {
            this.messageClass = 'alert alert-danger';
            this.message = data.message;
          } else {
            this.vacancy = {
              title: data.vacancy.title,
              hat: data.vacancy.hat,
              createdAt: data.vacancy.createdAt
            }
            this.foundVacancy = true;
          }
        });
      } else {
        this.message = 'Извините, но у Вас не права доступа на администрирования сайта';
        this.messageClass = 'alert alert-danger';
        this.router.navigate(['/vacancies']);
      }
    });
  }

  deleteVacancy() {
    this.vacanciesService.deleteVacancy(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.processing = true;
        this.vacanciesService.getAllVacancies();
        setTimeout(() => {
          this.router.navigate(['/vacancies']);
        }, 2000);
      }
    })
  }

}
