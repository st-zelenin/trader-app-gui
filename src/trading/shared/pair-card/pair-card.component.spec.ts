import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PairCardComponent } from './pair-card.component';

describe('PairCardComponent', () => {
  let component: PairCardComponent;
  let fixture: ComponentFixture<PairCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PairCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PairCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
