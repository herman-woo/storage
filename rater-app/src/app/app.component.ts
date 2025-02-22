import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'commerce-app';
}
