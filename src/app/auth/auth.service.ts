import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from './auth';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


const url = `${environment.apiurl}/users`;


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  cleartime: any;
  public isAuthenticated =  false;
  public validuser = new Subject<boolean>();
  clienttoken: string;
  userId: string;

  constructor(private http: HttpClient , private router: Router) { }
  gettoken(): string {
    return this.clienttoken;
  }
  signupuser(user) {
    this.http.post<{message: string, data: object}>(`${url}/signup` , user).subscribe(res => {
      console.log(res);
      this.router.navigate(['/']);
    }, err => {
      this.validuser.next(false);
    });

  }
  getuser() {
    return this.userId;
  }
  invokeauthdata() {
    const data  =  this.getauthdata();
    if (!data) {
      console.log('no auth data in storage');
      return;
    }
    console.log(data);
    const now = new Date();
    const futuretime = data.expiredate.getTime() -  now.getTime();
    if (futuretime > 0) {
    this.gettimer(futuretime / 1000);
    this.userId = data.userid;
    this.clienttoken = data.usertoken;
    this.isAuthenticated = true;
    this.validuser.next(true);
   }
  }
  private gettimer(duration: number) {
    console.log('timer' , duration);
    this.cleartime = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  loginuser(user) {
    const logindata: Auth = user;
    this.http.post<{message: string, token: string , expiresIn: number, userId: string}>(`${url}/login` , logindata)
    .subscribe(res => {
      const token = res.token;
      this.clienttoken = token;
      const tokenexpire = res.expiresIn;
      this.userId  = res.userId;
      this.gettimer(tokenexpire);
      this.isAuthenticated = true;
      this.validuser.next(true);
      const now = new Date();
      const expirationndate = new Date(now.getTime() + tokenexpire * 1000);
      this.saveauthdata(token, expirationndate, this.userId);
      this.router.navigate(['/']);
    }, error => {
      this.validuser.next(false);
    });
  }

  logout() {

    this.clienttoken = null;
    this.isAuthenticated = false;
    this.validuser.next(false);
    this.userId = null;
    clearTimeout(this.cleartime);
    this.clearauthdata();
    this.router.navigate(['/']);
  }

  private saveauthdata(token: string , expiredate: Date, userid: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('Date', expiredate.toISOString());
    localStorage.setItem('userId', userid);


  }
  private clearauthdata() {
    localStorage.removeItem('token');
    localStorage.removeItem('Date');
    localStorage.removeItem('userId');

  }

  private getauthdata() {
    const token = localStorage.getItem('token');
    const expdate = localStorage.getItem('Date');
    const userId = localStorage.getItem('userId');

    if (!token || !expdate) {
      return;
    }
    return{
      usertoken : token,
      expiredate : new Date(expdate),
      userid: userId
    };
  }
}
