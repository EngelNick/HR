import { Component, OnInit } from '@angular/core';
import { VacanciesService } from 'app/services/vacancies.service';
import { AuthService } from 'app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs/observable/interval';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.css']
})

export class VacanciesComponent implements OnInit {

  admin = false;
  loadingVacancies;
  vacanciesPosts;
  vacanciesArray;
  countArray;
  currentId;
  // username;
  // count;
  //  vacanciesCount;

  constructor(
    private vacanciesService: VacanciesService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    if (!this.admin) {
      this.authService.isAdmin().subscribe(data => {
        if (data.success) {
          this.admin = data.user.admin;
        }
      });
    }

    this.activatedRoute.params.subscribe(
      params => {
        if (isNaN(params['id'])) {
          this.currentId = 1;
        } else {
          this.currentId = +params['id'];
        }
      });

    this.getAllVacancies();
    if (!this.vacanciesService.loadingVacancies) {
      interval(25)
        .takeWhile(() => this.check())
        .subscribe(() => {
          this.getDataFromService();
        })
    } else {
      this.getDataFromService();
    }

  }

  check() {
    return !this.vacanciesArray;
  }

  refreshVacancies() {
    this.vacanciesService.loadingVacancies = false;
    this.getAllVacancies();
    setTimeout(() => {
      this.getDataFromService();
      this.vacanciesService.loadingVacancies = true;
    }, 2000);
  }

  redirect(id) {
    this.router.navigate(['/full-vacancy/', id]);
  }

  // getAllVacancies() {
  //   this.vacanciesService.getAllVacancies().subscribe(data => {
  //     if (this.vacanciesService.vacanciesPosts !== data.vacancies) {
  //       this.vacanciesService.loadingVacancies = false;
  //       this.vacanciesService.vacanciesArray = [];
  //       this.vacanciesService.countArray = [];
  //       this.vacanciesService.vacanciesPosts = data.vacancies;
  //       const vacanciesCount = this.vacanciesService.vacanciesPosts.length;
  //       let count;
  //       count = Math.ceil(vacanciesCount / 12);
  //       let s;
  //       for (let i = 1; i <= count; i++) {
  //         if (i === 1 && vacanciesCount === 13) {
  //           s = vacanciesCount - 1;
  //         } else {
  //           s = vacanciesCount;
  //         }
  //         for (let k = (i - 1) * 12; k < s; k++) {
  //           this.vacanciesService.vacanciesArray.push({ number: i, post: this.vacanciesService.vacanciesPosts[k] });
  //         }
  //       }
  //       for (let i = 1; i <= count; i++) {
  //         this.vacanciesService.countArray.push(i);
  //       }
  //       this.vacanciesService.loadingVacancies = true;
  //     } else {
  //       this.vacanciesService.loadingVacancies = true;
  //     }
  //   });
  // }

  getAllVacancies() {
    this.vacanciesService.getAllVacancies();
  }

  getDataFromService() {
    this.vacanciesPosts = this.vacanciesService.vacanciesPosts;
    this.vacanciesArray = this.vacanciesService.vacanciesArray;
    this.countArray = this.vacanciesService.countArray;
    this.loadingVacancies = this.vacanciesService.loadingVacancies;
  }

}
