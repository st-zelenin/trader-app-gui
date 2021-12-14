import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { BUY_MULTIPLICATORS } from '../../../constants';
import { SharedFacade } from '../../../store/shared';

@Component({
  selector: 'app-exchange-actions',
  templateUrl: './exchange-actions.component.html',
  styleUrls: ['./exchange-actions.component.scss'],
})
export class ExchangeActionsComponent implements OnInit {
  @Input() currencyPairs: string[] = [];
  @Input() usdt?: number = 0;

  @Output() addCurrencyPair = new EventEmitter<string>();
  @Output() refresh = new EventEmitter<void>();
  @Output() filter = new EventEmitter<void>();

  public multiplicators = BUY_MULTIPLICATORS;

  public currencyPairControl = new FormControl();
  public buyMultiplicatorControl = new FormControl('');

  public filteredOptions: Observable<string[]>;

  constructor(private readonly sharedFacade: SharedFacade) {
    this.filteredOptions = this.currencyPairControl.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      map((value) => (typeof value === 'string' ? value : value.id)),
      map((value) => this.filterPairs(value))
    );

    this.sharedFacade.buyMultiplicator.subscribe((buyMultiplicator) => {
      if (buyMultiplicator) {
        this.buyMultiplicatorControl.patchValue(buyMultiplicator, {
          emitEvent: false,
        });
      }
    });

    this.buyMultiplicatorControl.valueChanges.subscribe((value) => {
      this.sharedFacade.setBuyMultiplicator(value);
    });
  }

  ngOnInit(): void {}

  public addPair() {
    if (!this.currencyPairControl.value) {
      return;
    }

    this.addCurrencyPair.emit(this.currencyPairControl.value);
    this.currencyPairControl.setValue('');
  }

  private filterPairs(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log(value, this.currencyPairControl.value);

    return this.currencyPairs.filter((pair) =>
      pair.toLowerCase().includes(filterValue)
    );
  }
}
