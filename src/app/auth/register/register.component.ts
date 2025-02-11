import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../service/auth.service';
import {TokenStorageService} from '../../service/token-storage.service';
import {NotificationService} from '../../service/notification.service';

@Component({
selector: 'app-register',
templateUrl: './register.component.html',
styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

public registerForm: FormGroup;

constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.registerForm = this.createRegisterForm();
  }

  createRegisterForm(): FormGroup {
    return this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      username: ['', Validators.compose([Validators.required])],
      firstname: ['', Validators.compose([Validators.required])],
      lastname: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      confirmPassword: ['', Validators.compose([Validators.required])],
      isDiet: [false],
    });
  }

  submit(): void {
    console.log(this.registerForm.value);
    if(this.registerForm.value.isDiet){
      this.authService.registerDiet({
        email: this.registerForm.value.email,
        username: this.registerForm.value.username,
        firstname: this.registerForm.value.firstname,
        lastname: this.registerForm.value.lastname,
        password: this.registerForm.value.password,
        confirmPassword: this.registerForm.value.confirmPassword,
      }).subscribe(data => {
        console.log(data);
        this.notificationService.showSnackBar('Регистрация прошла успешно!');
      }, error => {
        this.notificationService.showSnackBar('Данный адрес электронный почты уже используется');
      });
    } else {
      this.authService.register({
        email: this.registerForm.value.email,
        username: this.registerForm.value.username,
        firstname: this.registerForm.value.firstname,
        lastname: this.registerForm.value.lastname,
        password: this.registerForm.value.password,
        confirmPassword: this.registerForm.value.confirmPassword,
        isDiet: this.registerForm.value.isDiet,
      }).subscribe(data => {
        console.log(data);
        this.notificationService.showSnackBar('Регистрация прошла успешно!');
      }, error => {
        this.notificationService.showSnackBar('Данный адрес электронный почты уже используется');
      });
    }


  }

}
