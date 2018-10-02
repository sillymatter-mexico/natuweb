import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  getNews() {
    return this.http.get('/api/v2/news/list/');
  }

  getNew(id: number) {
    return this.http.get('/api/v2/news/?new_id=' + id);
  }

  getAvatars(gender) {
    return this.http.get('/api/gamification/avatars/' + gender + '/');
  }
}
