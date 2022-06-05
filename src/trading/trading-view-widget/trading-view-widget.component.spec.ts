import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TradingViewWidgetComponent } from './trading-view-widget.component';

describe('TradingViewWidgetComponent', () => {
  let component: TradingViewWidgetComponent;
  let fixture: ComponentFixture<TradingViewWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TradingViewWidgetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TradingViewWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
