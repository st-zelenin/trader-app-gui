import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PairTabComponent } from './pair-tab.component';

describe('PairTabComponent', () => {
  let component: PairTabComponent;
  let fixture: ComponentFixture<PairTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PairTabComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PairTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
