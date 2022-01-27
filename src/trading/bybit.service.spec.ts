import { TestBed } from '@angular/core/testing';
import { BybitService } from './bybit.service';

describe('BybitService', () => {
  let service: BybitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BybitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
