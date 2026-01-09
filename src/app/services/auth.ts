import { Injectable } from '@angular/core';
import { Auth, authState, GoogleAuthProvider, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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

  async signOutFromProvider(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }

  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  get isAuthenticated(): boolean {
    return !!this.currentUser;
  }
}
