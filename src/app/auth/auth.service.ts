import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new Subject<User>();
  private tokenExpirationTimer;

  constructor(
    private http : HttpClient,
    private router: Router
  ) { }

  private handleAuth(email: string, userId: string, token: string, expiresIn: number){
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email,userId,token,expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData',JSON.stringify(user));
  }

  private handleError(err : HttpErrorResponse){
      let errorMes = 'An unknown error occured!';
      if (!err.error || !err.error.error) {
        return throwError(errorMes);
      }
      switch(err.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMes = 'This email already exists!';
          break;
        case 'EMAIL_NOT_FOUND':
          errorMes = "E-mail not found!";
          break;
        case 'INVALID_PASSWORD':
          errorMes = "Invalid credentials!";
          break;
      }
      return throwError(errorMes);
  }

  signup(email: string, password: string){
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBOi3EYHR9eGlHf-NTAMrFxgFUMqfFK-Yg',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(catchError(this.handleError),tap(res => {
        this.handleAuth(
          res.email,
          res.localId,
          res.idToken,
          +res.expiresIn
        );
      }));
  }

  login(email: string, password: string){
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBOi3EYHR9eGlHf-NTAMrFxgFUMqfFK-Yg',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(catchError(this.handleError),tap(res => {
        this.handleAuth(
          res.email,
          res.localId,
          res.idToken,
          +res.expiresIn
        );
      }));
  }

  autoLogin(){
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token){
      this.user.next(loadedUser);
      const expirationDate = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDate);
    }
  }

  logout(){
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number){
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    },expirationDuration);
  }
}
