import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CryptoComComponent } from './crypto-com.component';

describe('CryptoComComponent', () => {
  let component: CryptoComComponent;
  let fixture: ComponentFixture<CryptoComComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CryptoComComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoComComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
