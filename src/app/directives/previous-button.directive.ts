import {Directive, ElementRef, HostBinding, HostListener, OnInit, Renderer2} from '@angular/core';
import {RouterExtendService} from '../services/router-extend.service';
import {Router} from '@angular/router';

@Directive({
  selector: '[appPreviousButton]'
})
export class PreviousButtonDirective implements OnInit{

  @HostBinding('style.display') display: string;
  public previous: string;

  @HostListener('click') public onClick () {
    this.router.navigateByUrl(this.previous);
  }

  constructor(private routerExtend: RouterExtendService,
              private router: Router,
              private el: ElementRef,
              private renderer: Renderer2) {

  }

  ngOnInit() {
    this.previous = this.routerExtend.getPreviousUrl();
    if (!this.previous) {
      this.renderer.addClass(this.el.nativeElement, 'd-none');
    }
  }
}
