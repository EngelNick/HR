import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "app/services/auth.service";
import { Router } from "@angular/router"; 

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  messageClass;
  message;
  processing = false;
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm();
  }
  

  createForm() {
    this.form = this.fb.group({
      email: [
        '', Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30),
          this.validateEmail
        ])],
      username: [
        '', Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
          this.validateUserName
        ])],
      password: [
        '', Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30),
          this.validatePassword
        ])],
      confirm: [
        '',
        Validators.required
      ]
    }, { validator: this.matchingPassword('password', 'confirm') });
  }

  validateEmail(controls) {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateEmail': true }
    }
  }

  validateUserName(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateUserName': true }
    }
  }

  validatePassword(controls) {
    const regExp = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,30}$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validatePassword': true }
    }
  }

  matchingPassword(password, confirm) {
    return (group: FormGroup) => {
      if (group.controls.password.value === group.controls.confirm.value) {
        return null;
      } else {
        return { 'matchingPassword': true }
      }
    }
  }

  disableForm() {
    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();
  }

  enableForm() {
    this.form.controls['email'].enable();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
  }

  onRegisterSubmit() {
    this.processing = true;
    this.disableForm();
    const user = {
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value
    }

    this.authService.registerUser(user).subscribe(data => {
      if(!data.success) {
        this.messageClass = "alert alert-danger";
        this.message = data.message;
        this.processing = false;
        this.enableForm();
      } else {
        this.messageClass = "alert alert-success";
        this.message = data.message;
        setTimeout(() => {
          this.router.navigate(['/news']);
        }, 1500);
      }
    });
  }

  isEmpty(check) {
    return check.replace(/^\s+/g, '').length;
  }

  checkUsername () {
    const username = this.form.get('username').value;
    if(this.isEmpty(username)) {
      this.authService.checkUsername(username).subscribe(data => {
        if(!data.success) {
          this.usernameValid = false;
          this.usernameMessage = data.message;
        } else {
          this.usernameValid = true;
          this.usernameMessage = data.message;
      }
  });
    }
  }

    checkEmail () {
      const email = this.form.get('email').value;
       if(this.isEmpty(email)) {
         this.authService.checkEmail(email).subscribe(data => {
           if(!data.success) {
             this.emailValid = false;
             this.emailMessage = data.message;
            } else {
              this.emailValid = true;
              this.emailMessage = data.message;
      }
  });
  }
    }

  ngOnInit() {
  }

}
