import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {WorkshopService} from '../../services/workshop.service';
import * as moment from 'moment';
import {ToastrService} from 'ngx-toastr';
import {TabsetComponent} from 'ngx-bootstrap';

@Component({
  selector: 'app-workshop-filters',
  templateUrl: './workshop-filters.component.html',
  styleUrls: ['./workshop-filters.component.scss']
})
export class WorkshopFiltersComponent implements OnInit {

  public today: Date;
  public loading: boolean;
  public dayWorkshops: any;
  public drvWorkshops: any;
  public calendarWorkshops: any;
  public searchWorkshops: any;
  public selectedFilter: string;
  public date: Date;
  public dayNames: string[];
  public dayList: any[];
  public previousPage: string;
  public nextPage: string;
  public workshopLists: any;
  public drvList: any[];
  public selectedDRV: any;
  @ViewChild('filterTabs') filterTabs: TabsetComponent;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private workshopService: WorkshopService,
              private toastr: ToastrService) {
    this.today = new Date();
    this.loading = false;
    this.date = new Date();
    this.dayList = [];
    this.dayNames  = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'HOY'];
    this.dayWorkshops = {list: [], next: null, previous: null};
    this.calendarWorkshops = {list: [], next: null, previous: null};
    this.drvWorkshops = {list: [], next: null, previous: null};
    this.searchWorkshops = {list: [], next: null, previous: null};
    this.workshopLists = {
      dia: this.dayWorkshops,
      calendario: this.calendarWorkshops,
      drv: this.drvWorkshops,
      buscar: this.searchWorkshops
    };
    this.drvList = [];
    this.buildCalendar();
  }

  ngOnInit() {
    this.route.queryParamMap
      .subscribe((params: any) => {
        this.selectedFilter = params.get('filtro');
        this.fetchWorkshops();
      });
  }

  private buildCalendar() {
    const currentDate = moment();
    const day = currentDate.day();

    for (let x = 0; x <= 31; x++) {
      const m = moment();
      if (x < day) {
        m.subtract(day - x, 'days');
      } else if (x > day) {
        m.add(x - day, 'days');
      }
      const dayName = (x === day) ? this.dayNames[7] : this.dayNames[x % 7];

      const dayObject = {
        name: dayName,
        number: m.format('D'),
        month: m.format('M'),
        year: m.format('YYYY')
      };

      this.dayList.push(dayObject);
    }
  }

  onSelectFilter(filter: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
       filtro: filter
      }
    });
  }

  private fetchWorkshops() {
    this.nextPage = null;
    this.previousPage = null;
    switch (this.selectedFilter) {
      case 'calendario':
        this.filterTabs.tabs[0].active = true;
        if (this.calendarWorkshops.list.length === 0) {
          const day = this.date.getDate();
          const month = this.date.getMonth() + 1;
          const year = this.date.getFullYear();
          this.getDayWorkshops(day, month, year);
        } else {
          this.previousPage = this.calendarWorkshops.previous;
          this.nextPage = this.calendarWorkshops.next;
          this.loading = false;
        }
        break;
      case 'drv':
        this.filterTabs.tabs[1].active = true;
        if (this.drvWorkshops.list.length === 0) {
          this.fetchDrvData();
        } else {
          this.previousPage = this.drvWorkshops.previous;
          this.nextPage = this.drvWorkshops.next;
          this.loading = false;
        }
        break;
      case 'dia':
        this.filterTabs.tabs[2].active = true;
        if (this.dayWorkshops.list.length === 0) {
          const day = this.today.getDate();
          const month = this.today.getMonth() + 1;
          const year = this.today.getFullYear();
          this.getDayWorkshops(day, month, year);
        } else {
          this.previousPage = this.dayWorkshops.previous;
          this.nextPage = this.dayWorkshops.next;
          this.loading = false;
        }
        break;
      case 'buscar':
        this.filterTabs.tabs[3].active = true;
        if (this.searchWorkshops.list.length === 0) {
          break;
        } else {
          this.previousPage = this.drvWorkshops.previous;
          this.nextPage = this.drvWorkshops.next;
          this.loading = false;
        }
        break;
      default: break;
    }
  }

  public getDayWorkshops(day: number, month: number, year: number) {
    this.loading = true;
    if (this.selectedFilter === 'calendario') {
      this.date = new Date(year, month - 1, day);
    }
    this.workshopService.getWorkshopsByDate(day, month, year)
      .subscribe((response: any) => {
        this.workshopLists[this.selectedFilter].list = response.workshop;
        this.workshopLists[this.selectedFilter].next = this.nextPage = response.nextPage;
        this.workshopLists[this.selectedFilter].previous = this.previousPage = response.previousPage;
        this.loading = false;
      }, (error: any) => {
        this.loading = false;
        console.log(error);
        this.toastr.error('Lo sentimos, ocurrió un error al cargar los talleres del día seleccionado');
      });
  }

  getDateWorkshops(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    this.getDayWorkshops(day, month, year);
  }

  fetchDrvData() {
    this.loading = true;
    this.workshopService.getDRVList()
      .subscribe((response: any) => {
        this.drvList = response.filter(x => x.name !== '');
        this.selectedDRV = this.drvList[0];
        this.getDrvWorkshops();
      }, (error: any) => {
        this.loading = false;
        console.log(error);
        this.toastr.error('Lo sentimos, ocurrió un error al cargar la lista de DRVs');
      }
    );
  }

  getDrvWorkshops() {
    this.loading = true;
    this.workshopService.getWorkshopsByDRV(this.selectedDRV.id)
      .subscribe((response: any) => {
        this.drvWorkshops.list = response.workshop;
        this.drvWorkshops.next = this.nextPage = response.nextPage;
        this.drvWorkshops.previous = this.previousPage = response.previousPage;
        this.nextPage = this.drvWorkshops.next;
        this.loading = false;
      }, (error: any) => {
        this.loading = false;
        console.log(error);
        this.toastr.error('Lo sentimos, ocurrió un error al cargar los talleresdel DRV seleccionado');
      });
  }

  public getActiveDay(day: any) {
    return (this.date.getDate() === parseInt(day.number, 10) && (this.date.getMonth() + 1) === parseInt(day.month, 10));
  }

  public getPage(url: string) {
    this.loading = true;
    this.previousPage = this.nextPage = null;
    this.workshopService.getWorkshopPage(url)
      .subscribe((data: any) => {
        this.loading = false;
        this.workshopLists[this.selectedFilter].list = data.workshop;
        this.workshopLists[this.selectedFilter].previous = this.previousPage = data.previousPage;
        this.workshopLists[this.selectedFilter].next = this.nextPage = data.nextPage;
      }, (error: any) => {
        console.log(error);
        this.loading = false;
        this.toastr.error('Lo sentimos, ocurrió un error al cargar la lista de talleres');
      });
  }

}
