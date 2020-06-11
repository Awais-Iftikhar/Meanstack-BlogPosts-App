import { Component, OnInit } from '@angular/core';
import { Form, FormGroup, FormControl, Validators , NgForm} from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
isloading = false;
form: FormGroup;
  constructor(private authservice: AuthService) { }

  ngOnInit() {
    console.log('sign up');
    this.authservice.validuser.subscribe(res => {
      this.isloading = res;
    });

  }
  signup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isloading = true;
    const userdata = form.value;
    this.authservice.signupuser(userdata);
  }

}
