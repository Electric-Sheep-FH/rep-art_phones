import { Component } from '@angular/core';

@Component({
  selector: 'app-carousel-test',
  standalone: true,
  imports: [],
  templateUrl: './carousel-test.component.html',
  styleUrl: './carousel-test.component.css'
})
export class CarouselTestComponent {
  // 6 cartes => 6 états d'ouverture
  expanded = [false, false, false, false, false, false];

  toggle(i: number) {
    this.expanded[i] = !this.expanded[i];
  }
}
