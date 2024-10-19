import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FishnetComponent } from './fishnet.component';

describe('FishnetComponent', () => {
  let component: FishnetComponent;
  let fixture: ComponentFixture<FishnetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FishnetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FishnetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
