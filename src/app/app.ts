import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthC } from "./components/auth/auth";
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('vocab-web-app');

  user$: Observable<User | null>;

  constructor(private authService: AuthService, private router: Router) {
      this.user$ = this.authService.user$;
    }
  
  goToProfile() {
    this.router.navigate(['/user']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
