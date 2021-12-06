import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PairPanelComponent } from './pair-panel.component';

describe('PairPanelComponent', () => {
  let component: PairPanelComponent;
  let fixture: ComponentFixture<PairPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PairPanelComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PairPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
