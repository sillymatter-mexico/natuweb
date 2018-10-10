import { Component, OnInit } from '@angular/core';
import {AppService} from '../../services/app.service';
import {take} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  public news: any[];
  public loading: boolean;

  constructor(private appService: AppService, private toastr: ToastrService) {
    this.news = this.appService.news;
    this.loading = false;
  }

  ngOnInit() {
    if (this.news.length === 0) {
      this.fetchNews();
    }
  }

  private fetchNews() {
    this.loading = true;
    this.appService.getNews()
      .pipe(take(1))
      .subscribe((response: any) => {
        this.loading = false;
        this.news = response;
      }, error => {
        this.toastr.error('Lo sentimos, ocurrió un error con el servidor', 'Error');
        this.loading = false;
        console.log(error);
      });
  }

}
