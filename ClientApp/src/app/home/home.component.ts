import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  // Disqus
  pageUrl: string = window.location.href;
  pageIdentifier: string = window.location.href;
}
