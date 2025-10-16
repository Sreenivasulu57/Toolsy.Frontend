import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup {
  constructor(private router: Router) {}

  goToUserSignup() {
    this.router.navigate(['/usersignup']);
  }

  goToOwnerSignup() {
    this.router.navigate(['/ownersignup']);
  }
}
