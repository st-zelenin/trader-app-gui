import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HistoryService } from '../../history.service';
import { Order, PairAverages, TickerInfo, TradePair } from '../../models';

@Component({
  selector: 'app-pair-tab',
  templateUrl: './pair-tab.component.html',
  styleUrls: ['./pair-tab.component.scss'],
})
export class PairTabComponent implements OnInit {
  @Input() pair!: TradePair;

  public tickerInfo: Observable<TickerInfo> | undefined = undefined;
  public tradeAverages: Observable<PairAverages> | undefined = undefined;
  // public openOrders: Observable<Order[]> | undefined = undefined;
  public displayedColumns: string[] = ['ID', 'side', 'amount', 'price', 'star'];
  public orders: Order[] = [];

  constructor(
    private readonly historyService: HistoryService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.calcAverages();
    this.updateTickerInfo();
    this.getOpenOrders();
  }

  public importAll(): void {
    this.historyService.importAll(this.pair.id).subscribe((data) => {
      this.showSnackBar('history imported');
    });
  }

  public updateRecent(): void {
    this.historyService.updateRecent(this.pair.id).subscribe((data) => {
      this.showSnackBar('recent history updated');
    });
  }

  public calcAverages(): void {
    this.tradeAverages = this.historyService.calcAverages(this.pair.id);
  }

  public updateTickerInfo() {
    this.tickerInfo = this.historyService
      .getSingleTickerInfo(this.pair.id)
      .pipe(tap(console.log));
  }

  public getOpenOrders() {
    // this.openOrders = this.historyService.getOpenOrders(this.pair.id).pipe(tap(console.log));
    this.historyService
      .getOpenOrders(this.pair.id)
      .pipe(tap(console.log))
      .subscribe((orders) => {
        this.orders = orders;
      });
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'x', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
