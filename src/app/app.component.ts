import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { ParallaxComponent } from './parallax-test/parallax-test.component';
import { CarouselTestComponent } from './carousel-test/carousel-test.component';
import { ContactComponent } from './contact/contact.component';
import { GalerieComponent, PhotoItem } from './galerie/galerie.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ParallaxComponent, CarouselTestComponent, ContactComponent, GalerieComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'repart-phone';

  firstGallerie: PhotoItem[] = [
    { src: 'phone-wet.png', alt: 'Atelier', caption: 'On se mouille pour votre bien-être et celui de votre téléphone', rotate: -6, posY: 20, capAnchor: 'top-left' },
    { src: 'falled-phone.png', alt: 'Devis', caption: 'Ecran cassé ? La solution est ici', rotate: 10, capAnchor: 'center' },
    {
      src: 'superphone.png', alt: 'Garantie', caption: '13 années que je rafistole vos écrans, et toujours pas de cape de super-héros', rotate: -10, posY: 25, capAnchor: 'bottom-center', capAlign: 'center', capOffsetY: -100
    },
  ];

  secondGallerie: PhotoItem[] = [
    { src: 'breaked-screen.png', alt: 'Atelier', caption: 'Parce qu\'un écran fissuré ne mérite pas de briser ta journée', rotate: 12, posY: 20, capAnchor: 'top-left', capOffsetY: 50 },
    {
      src: 'soudure.jpg', alt: 'Devis', caption: 'Le remplacement d\'un petit composant peut rendre le sourire', rotate: -5, capAnchor: 'bottom-center', capOffsetY: -100, capOffsetX: -100
    },
    { src: 'console-ex.png', alt: 'Garantie', caption: 'On répare tout... Sauf les textos gênants envoyés à ton ex.', rotate: -3, posY: 60, capOffsetY: -70 },
  ];

}