import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Auth, authState, GoogleAuthProvider, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class AuthC {
  user$: Observable<User | null>;

  constructor(private auth: Auth) {
    this.user$ = authState(this.auth);
  }

  async signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(this.auth, provider);
    } catch (error) {
      console.error('Google sign-in failed:', error);
      alert('Sign in failed. Please try again.');
    }
  }

  async signOutFromGoogle(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }
}
