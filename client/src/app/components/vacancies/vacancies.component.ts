import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { VacanciesService } from 'app/services/vacancies.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.css']
})

export class VacanciesComponent implements OnInit {

  admin = false;
  loadingVacancies = false;
  username;
  vacanciesPosts;
  vacanciesArray = [];
  vacanciesCount;
  count;
  countArray = [];
  currentId;

  constructor(
    private vacanciesService: VacanciesService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

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

    this.activatedRoute.params.subscribe(
      params => {
        if (isNaN(params['id'])) {
          this.currentId = 1;
        } else {
          this.currentId = +params['id'];
        }
      });


    this.getAllVacancies();
    this.loadingVacancies = true;
  }

  getAllVacancies() {
    this.vacanciesArray = [];
    this.countArray = [];
    this.vacanciesService.getAllVacancies().subscribe(data => {
      this.vacanciesPosts = data.vacancies;
      this.vacanciesCount = this.vacanciesPosts.length;
      this.count = Math.ceil(this.vacanciesCount / 12);
      let s;
      for (let i = 1; i <= this.count; i++) {
        if (i === 1 && this.vacanciesCount === 13) {
          s = this.vacanciesCount - 1;
        } else {
          s = this.vacanciesCount;
        }
        for (let k = (i - 1) * 12; k < s; k++) {
          this.vacanciesArray.push({number: i, post: this.vacanciesPosts[k]});
        }
      }

      for (let i = 1; i <= this.count; i++) {
        this.countArray.push(i);
      }
    });
  }

  refreshVacancies() {
    this.loadingVacancies = false;
    this.getAllVacancies();
    setTimeout(() => {
      this.loadingVacancies = true;
    }, 2000);
  }

  redirect(id) {
    this.router.navigate(['/full-vacancy/', id]);
  }

}
