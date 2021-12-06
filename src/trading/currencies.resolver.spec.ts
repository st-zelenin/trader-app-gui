import { TestBed } from '@angular/core/testing';

import { CurrenciesResolver } from './currencies.resolver';

describe('CurrenciesResolver', () => {
  let resolver: CurrenciesResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CurrenciesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
