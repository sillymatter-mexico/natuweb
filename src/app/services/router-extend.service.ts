import { Injectable } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterExtendService {

  private navigationStack: any[];

  constructor(private router: Router) {
    this.navigationStack = [];
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const navLength = this.navigationStack.length;
        this.navigationStack.push(event.url);
        console.log(this.navigationStack);
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
    const lastPage: string = this.navigationStack[navLength - 2];
    this.router.navigate([lastPage]);
    this.navigationStack.splice(navLength - 2, 2);
  }
}
