import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
isloading = false;
form: FormGroup;
  constructor(private authservice: AuthService) { }

  ngOnInit() {
    this.form = new FormGroup({
        email : new FormControl(null, {validators: [Validators.required ]}),
        password : new FormControl(null, {validators: [Validators.required]}),
    });
    this.authservice.validuser.subscribe(res => {
      this.isloading = res;
      this.form.reset();
    });
  }
  login(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isloading = true;
    const logindata = form.value;
    this.authservice.loginuser(logindata);
  }

}
