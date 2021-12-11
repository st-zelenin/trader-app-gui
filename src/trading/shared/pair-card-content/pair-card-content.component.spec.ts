import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PairCardContentComponent } from './pair-card-content.component';

describe('PairCardContentComponent', () => {
  let component: PairCardContentComponent;
  let fixture: ComponentFixture<PairCardContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PairCardContentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PairCardContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
