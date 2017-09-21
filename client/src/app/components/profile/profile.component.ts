import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username;
  email;
  admin;
  loadingProfile;

  constructor(
    private authService: AuthService
  ) {
  }
  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      if (!this.authService.loadingProfile) {
      this.authService.username = profile.user.username;
      this.authService.email = profile.user.email;
      this.authService.admin = profile.user.admin ? 'Вы имеете права администратора' : 'Вы не администратор';
      this.getDataFromAuthService();
    } else {
      this.getDataFromAuthService();
    }
    });
  }

  getDataFromAuthService() {
    this.username = this.authService.username;
    this.email = this.authService.email;
    this.admin = this.authService.admin;
    this.loadingProfile = true;
  }

}
