import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthC } from "./components/auth/auth";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, AuthC],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('vocab-web-app');
}
