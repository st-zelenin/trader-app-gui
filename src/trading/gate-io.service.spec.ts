import { TestBed } from '@angular/core/testing';

import { GateIoService } from './gate-io.service';

describe('GateIoService', () => {
  let service: GateIoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GateIoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
