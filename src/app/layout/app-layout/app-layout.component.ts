import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavSidebarComponent } from '../nav-sidebar/nav-sidebar.component';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, NavSidebarComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css',
})
export class AppLayoutComponent {}
