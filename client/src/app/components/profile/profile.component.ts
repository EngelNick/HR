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

  constructor(
    private authService: AuthService
  ) {
  }
  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      if (this.username !== profile.user.username && this.admin !== profile.user.admin) {
      this.username = profile.user.username;
      this.email = profile.user.email;
      this.admin = profile.user.admin ? 'Вы имеете права администратора' : 'Вы не администратор';
    } else {
    }
    });
  }

}
