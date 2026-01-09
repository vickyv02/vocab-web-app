import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class AuthC {
  user$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$;
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle();
  }

  signOutFromProvider() {
    this.authService.signOutFromProvider();
  }
}
