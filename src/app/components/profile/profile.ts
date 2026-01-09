import { Component } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
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
