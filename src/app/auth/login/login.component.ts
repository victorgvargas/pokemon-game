import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService, AuthResponseData } from '../auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email : new FormControl(null, [Validators.required, Validators.email]),
    password : new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  isLoading : boolean = false;
  error : string = null;
  authObs : Observable<AuthResponseData>;

  constructor(
      private authService : AuthService,
      private router: Router
    ) { }

  ngOnInit(): void {
  }

  onSubmit(type: string){
    if (!this.loginForm.valid) {
      return;
    }
    this.isLoading = true;
    if (type == "login") {
      this.authObs = this.authService.login(this.loginForm.value.email,this.loginForm.value.password);
    }
    if (type == "signup") {
      this.authObs = this.authService.signup(this.loginForm.value.email,this.loginForm.value.password);
    }
    this.authObs.subscribe(res => {
      console.log(res);
      this.isLoading = false;
      this.router.navigate(['/home']);
      
    },err => {
      console.log(err);
      this.error = err;
      this.isLoading = false;
    });

    this.loginForm.reset();
  }

}
