import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  onNavClick(event: Event, id: string) {
    event.preventDefault();        // évite le #… par défaut
    this.menuOpen = false;         // ferme le menu
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // fallback: met à jour le hash si l’élément n’est pas encore présent
      location.hash = id;
    }
  }

  scrollTop(event: Event) {
    event.preventDefault();
    this.menuOpen = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
