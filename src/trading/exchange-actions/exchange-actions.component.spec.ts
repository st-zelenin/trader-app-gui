import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeActionsComponent } from './exchange-actions.component';

describe('ExchangeActionsComponent', () => {
  let component: ExchangeActionsComponent;
  let fixture: ComponentFixture<ExchangeActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExchangeActionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
