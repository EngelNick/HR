import { Injectable } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class VacanciesService {
  options;
  domain = this.authService.domain;

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
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/vacancies/allvacancies/', this.options).map(res => res.json());
  }

  getSingleVacancy(id) {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/vacancies/singleVacancy/' + id, this.options).map(res => res.json());
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
