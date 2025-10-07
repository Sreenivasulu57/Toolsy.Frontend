import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-signup',
  imports: [ButtonModule,],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']  // <-- corrected
})
export class Signup {}
