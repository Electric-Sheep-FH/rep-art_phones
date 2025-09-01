import {
  Component, Input, ElementRef, NgZone, Inject, PLATFORM_ID, OnDestroy, AfterViewInit
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-parallax',
  templateUrl: './parallax-test.component.html',
  styleUrls: ['./parallax-test.component.css'],
  standalone: true
})
export class ParallaxComponent implements AfterViewInit, OnDestroy {
  @Input() imageUrl = '';
  @Input() height = '500px';

  /** Vitesse (0 = fixe, 1 = suit le scroll). Mobile plus doux par défaut. */
  @Input() speedDesktop = 0.5;
  @Input() speedMobile = 0.25;

  /** Largeur max considérée comme mobile (px) */
  @Input() mobileBreakpoint = 768;

  private isBrowser = false;
  private removeScroll?: () => void;
  private ticking = false;
  private prefersReducedMotion = false;

  constructor(
    private host: ElementRef<HTMLElement>,
    private zone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser && 'matchMedia' in window) {
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    // Calcul initial
    this.updateParallax();

    // Listener scroll performant (passive + rAF), hors Angular pour éviter le churn de détection
    this.zone.runOutsideAngular(() => {
      const onScroll = () => {
        if (!this.ticking) {
          this.ticking = true;
          requestAnimationFrame(() => {
            this.updateParallax();
            this.ticking = false;
          });
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });

      this.removeScroll = () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      };
    });
  }

  ngOnDestroy(): void {
    if (this.removeScroll) this.removeScroll();
  }

  private updateParallax(): void {
    const el = this.host.nativeElement;
    const media = el.querySelector<HTMLElement>('.parallax-media');
    if (!media) return;

    // Si l’utilisateur préfère moins d’animations, on ne bouge pas.
    if (this.prefersReducedMotion) {
      media.style.setProperty('--parallax-y', '0px');
      return;
    }

    const rect = el.getBoundingClientRect();
    const viewportH = window.innerHeight || document.documentElement.clientHeight;

    // Ne calcule que si visible à l’écran
    if (rect.bottom < 0 || rect.top > viewportH) return;

    const mid = rect.top + rect.height / 2; // centre du bloc
    const distanceFromCenter = mid - viewportH / 2;

    const isMobile = window.innerWidth <= this.mobileBreakpoint;
    const speed = isMobile ? this.speedMobile : this.speedDesktop;

    // Décalage (ajuste le facteur si tu veux un effet plus/moins fort)
    const translateY = -distanceFromCenter * speed;

    // On expose via une custom property CSS (plus propre et composable)
    media.style.setProperty('--parallax-y', `${translateY}px`);
  }
}
