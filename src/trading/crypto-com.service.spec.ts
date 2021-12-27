import { TestBed } from '@angular/core/testing';
import { CryptoComService } from './crypto-com.service';

describe('CryptoComService', () => {
  let service: CryptoComService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptoComService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
