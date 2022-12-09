import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import axios from 'axios';
import * as $ from 'jquery';

const AUTH_API = 'https://krycaptial.procedurerock.com:8080/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: any = null;

  constructor(private http: HttpClient) { }

  loginUser(formdata: any): Observable<any> {
    const params = new HttpParams({
      fromObject: formdata
    });
    return this.http.post(AUTH_API + 'token', params, httpOptions);
  }
  setToken(_token: any) {
    this.token = _token;
  }
  loginOtp(formdata: any): Observable<any> {
    const params = new HttpParams({
      fromObject: formdata
    });
    return this.http.post(
      AUTH_API + 'login/otp',
      params,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          "Authorization": "Bearer " + this.token
        })
      })
  }
  getRandomImages(userid: string): Observable<any> {
    const params = new HttpParams().set('userid', userid);
    return this.http.get(AUTH_API + 'randomimage', { params });
  }
  verifyImage(formdata: any): Observable<any> {
    const params = new HttpParams({
      fromObject: formdata
    });
    return this.http.post(
      AUTH_API + 'verifyImage',
      params,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + this.token
        })
      })
  }

  // signup
  createUser(formdata: any): any {
    const params = new HttpParams({
      fromObject: formdata
    });
    return this.http.post(AUTH_API + 'createuser', params, httpOptions);
  }
  registerOtp(formdata: any): Observable<any> {
    const params = new HttpParams({
      fromObject: formdata
    });
    return this.http.post(AUTH_API + 'signup/otp', params, httpOptions);
  }
  getQuestions(): Observable<any> {
    return this.http.get(AUTH_API + 'questions');
  }
  signupSubmit(formdata: any): Observable<any> {
    const params = new HttpParams({
      fromObject: formdata
    });
    return this.http.post(AUTH_API + 'signupSubmit', params, httpOptions);
  }
  check_email_signup(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.get(AUTH_API + 'email', { params });
  }
  check_email_login(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.get(AUTH_API + 'login/email', { params });
  }
}
