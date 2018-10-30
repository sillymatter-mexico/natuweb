import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AngularFirestore} from '@angular/fire/firestore';
import {map, take} from 'rxjs/operators';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private _news: any[];
  public sidebarToggle: EventEmitter<boolean> = new EventEmitter<boolean>();
  public sidebarToggled: boolean;

  constructor(private http: HttpClient,
              private afs: AngularFirestore,
              private breakpointObserver: BreakpointObserver) {
    this.news = [];
    this.sidebarToggled = false;
    this.breakpointObserver
      .observe(['(min-width: 768px)'])
      .subscribe((result: any) => {
        this.setSidebarState(result.matches);
      });
  }

  get news() {
    return this._news;
  }

  set news(news: any) {
    this._news = news;
  }

  getNews() {
    return this.afs.collection('/news').valueChanges().pipe(take(1));
  }

  getInitData() {
    return this.http.get('/api/v2/news/list/')
            .pipe(map ((response: any) => response.data));
  }

  getNew(id: number) {
    return this.http.get('/api/v2/news/?new_id=' + id)
            .pipe(map ((response: any) => response.data));
  }

  getAvatars(gender) {
    return this.http.get('/api/gamification/avatars/' + gender + '/')
            .pipe(map ((response: any) => response.data));
  }

  toggleSidebar() {
    this.sidebarToggled = !this.sidebarToggled;
    this.sidebarToggle.emit(this.sidebarToggled);
  }

  setSidebarState(toggled: boolean) {
    this.sidebarToggled = toggled;
    this.sidebarToggle.emit(this.sidebarToggled);
  }
}
