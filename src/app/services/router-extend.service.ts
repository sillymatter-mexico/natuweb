import { Injectable } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, UrlTree} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterExtendService {

  private navigationStack: any[];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.navigationStack = [];
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        (<any>window).ga('set', 'page', event.urlAfterRedirects);
        (<any>window).ga('send', 'pageview');
        const tree: UrlTree = router.parseUrl(event.url);
        const params: any = {...tree.queryParams};
        tree.queryParams = {};
        const data =  {
          params: params,
          url: this.router.serializeUrl(tree)
        };
        this.navigationStack.push(data);
      }
    });
  }

  public getPreviousUrl() {
    const navLength = this.navigationStack.length;
    let lastPage: string;
    if (navLength > 1) {
      lastPage = this.navigationStack[navLength - 2];
      return lastPage;
    }
    return null;
  }

  public goToPreviousUrl() {
    const navLength = this.navigationStack.length;
    const lastPage: any = this.navigationStack[navLength - 2];
    this.router.navigate([lastPage.url], {queryParams: lastPage.params});
    this.navigationStack.splice(navLength - 2, 2);
  }


}
