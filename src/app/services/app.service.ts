import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AngularFirestore} from '@angular/fire/firestore';
import {take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private _news: any[];

  constructor(private http: HttpClient, private afs: AngularFirestore) {
    this.news = [];
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
    return this.http.get('/api/v2/news/list/');
  }

  getNew(id: number) {
    return this.http.get('/api/v2/news/?new_id=' + id);
  }

  getAvatars(gender) {
    return this.http.get('/api/gamification/avatars/' + gender + '/');
  }
}
