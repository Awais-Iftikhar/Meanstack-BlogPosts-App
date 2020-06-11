import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  validationlistener = false;
  constructor(private authservice: AuthService) { }

  ngOnInit() {
    this.validationlistener = this.authservice.isAuthenticated;
    this.authservice.validuser.subscribe(result => {
      this.validationlistener = result;
    });
  }

  logoutuser() {
    this.authservice.logout();
  }

}
