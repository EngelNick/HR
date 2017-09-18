import { Component, OnInit, Renderer } from '@angular/core';
import { AuthService } from "app/services/auth.service";
import { VacanciesService } from "app/services/vacancies.service";
import { SafeHtmlPipe } from "app/pipes/safeHtml.pipe";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-full-vacancy',
  templateUrl: './full-vacancy.component.html',
  styleUrls: ['./full-vacancy.component.css']
})
export class FullVacancyComponent implements OnInit {
    
    currentUrl;
    admin = false;
    message;
    messageClass
    username;
    vacancy;
    loading = true;
    width;
    height;
    
  
    constructor(
      private authService: AuthService,
      private activatedRoute: ActivatedRoute,
      private vacanciesService: VacanciesService,
      private renderer: Renderer
    ) {
      
    }
  
    ngOnInit() {
      // this.authService.getProfile().subscribe(profile => {
      //   if (profile.success) {
      //     this.username = profile.user.username;
      //   }
      // });
      
      this.authService.isAdmin().subscribe(data => {
        if (data.success) {
          this.admin = data.user.admin;
        }
      });
  
     this.getSingleNewsItem();
    }
  
    getSingleNewsItem(){
      this.currentUrl = this.activatedRoute.snapshot.params;
      this.vacanciesService.getSingleVacancy(this.currentUrl.id).subscribe(data => {
        if(!data.success) {
          this.message = data.message;
          this.messageClass = "alert alert-danger";
        } else {
          this.vacancy = data.vacancy;
          this.loading = false;
          this.message = data.message;
          this.messageClass = "alert alert-success";
        }
      });
    }

    isUrl() {
      if(this.vacancy.url.indexOf("http") >=0 ) return true;
      else return false;
    }

    dimensions(event) {
      this.width = event.target.width;
      this.height = event.target.height;
      // console.log(this.width + ' ' + this.height );
    }
}
