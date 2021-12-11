import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GateIoComponent } from './gate-io.component';

describe('GateIoComponent', () => {
  let component: GateIoComponent;
  let fixture: ComponentFixture<GateIoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GateIoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GateIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
