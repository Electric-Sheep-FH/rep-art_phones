import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type PhotoItem = {
  src: string;
  alt?: string;
  caption?: string;
  rotate?: number; // en degrés, ex: -6, 8, etc.

  fit?: 'cover' | 'contain';
  posX?: number; // 0–100 (%)
  posY?: number; // 0–100 (%)
  zoom?: number; // ex: 0.9, 1, 1.1
  capAnchor?: 'top-left' | 'top-center' | 'top-right'
  | 'center'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';
  capOffsetX?: number;     // décalage horizontal en px (+: droite, -: gauche)
  capOffsetY?: number;     // décalage vertical en px (+: bas, -: haut)
  capAlign?: 'left' | 'center' | 'right';   // alignement du texte
};

@Component({
  selector: 'app-galerie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './galerie.component.html',
  styleUrl: './galerie.component.css'
})
export class GalerieComponent {
  @Input() photos: PhotoItem[] = [];

  /** Hauteur des cartes (px) */
  @Input() height = 360;

  /** Option 1 : angle de la pente (défaut 45°) -> calcule cut = height * tan(angle) */
  @Input() slopeDeg = 45;

  /** Option 2 : largeur du biseau en px (si défini, prioritaire sur slopeDeg) */
  @Input() cut?: number;

  /** Légendes au survol (true) ou toujours visibles (false) */
  @Input() hoverReveal = true;


  /** Carrousel mobile */
  @Input() mobileCarousel = true;
  @Input() mobileIntervalMs = 5000;   // vitesse de défilement
  @Input() mobileTransitionMs = 1000;  // durée de l'animation (CSS)
  currentIndex = 0;

  private mql?: MediaQueryList;
  private timer?: number;
  private prefersReduced?: MediaQueryList;

  get count(): number { return this.photos?.length ?? 0; }
  get overlaps(): number { return Math.max(0, this.count - 1); }

  /** Largeur effective du biseau en px */
  get effectiveCut(): number {
    if (this.cut != null) return this.cut;
    const rad = (this.slopeDeg ?? 45) * Math.PI / 180;
    const tan = Math.tan(rad);
    return Math.round(this.height * tan);
  }

  edge(i: number): 'left' | 'right' | 'both' | 'none' {
    if (this.count <= 1) return 'none';
    if (i === 0) return 'right';
    if (i === this.count - 1) return 'left';
    return 'both';
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    this.mql = window.matchMedia('(max-width: 560px)');
    this.prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const maybeStart = () => {
      this.stopAutoplay();
      if (this.mobileCarousel && this.mql!.matches && !this.prefersReduced!.matches && this.photos.length > 1) {
        this.startAutoplay();
      } else {
        this.currentIndex = 0; // revient au début si on sort du mode mobile
      }
    };

    this.mql.addEventListener('change', maybeStart);
    this.prefersReduced.addEventListener('change', maybeStart);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.stopAutoplay(); else maybeStart();
    });

    maybeStart();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
    this.mql?.removeEventListener('change', () => { });
    this.prefersReduced?.removeEventListener('change', () => { });
  }

  private startAutoplay() {
    this.stopAutoplay();
    this.timer = window.setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.photos.length;
    }, this.mobileIntervalMs);
  }

  private stopAutoplay() {
    if (this.timer) { clearInterval(this.timer); this.timer = undefined; }
  }
}
