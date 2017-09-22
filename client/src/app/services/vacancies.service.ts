import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class VacanciesService {
  options;
  domain = this.authService.domain;
  vacanciesPosts;
  loadingVacancies;
  vacanciesArray;
  countArray;

  constructor(
    private authService: AuthService,
    private http: Http
  ) { }

    createAuthenticationHeaders() {
    this.authService.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authService.authToken
      })
    });
  }

  newVacancy(vacancy) {
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + '/vacancies/newvacancy/', vacancy, this.options).map(res => res.json());
  }

  getAllVacancies() {
    this.http.get(this.domain + '/vacancies/allvacancies/').map(res => res.json()).subscribe(data => {
      if (this.vacanciesPosts !== data.vacancies) {
        this.loadingVacancies = false;
        this.vacanciesArray = [];
        this.countArray = [];
        this.vacanciesPosts = data.vacancies;
        const vacanciesCount = this.vacanciesPosts.length;
        let count;
        count = Math.ceil(vacanciesCount / 12);
        let s;
        for (let i = 1; i <= count; i++) {
          if (i === 1 && vacanciesCount === 13) {
            s = vacanciesCount - 1;
          } else {
            s = vacanciesCount;
          }
          for (let k = (i - 1) * 12; k < s; k++) {
            this.vacanciesArray.push({ number: i, post: this.vacanciesPosts[k] });
          }
        }
        for (let i = 1; i <= count; i++) {
          this.countArray.push(i);
        }
        this.loadingVacancies = true;
      } else {
        this.loadingVacancies = true;
      }
    });
  }

  getSingleVacancy(id) {
    return this.http.get(this.domain + '/vacancies/singleVacancy/' + id).map(res => res.json());
  }

  editVacancy(vacancy) {
    this.createAuthenticationHeaders();
    return this.http.put(this.domain + '/vacancies/updateVacancy/', vacancy , this.options).map(res => res.json());
  }

  deleteVacancy(id) {
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + '/vacancies/deleteVacancy/' + id, this.options).map(res => res.json());
  }

}
