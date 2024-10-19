import { EXCHANGE, ExchangeUrlParams } from '../constants';

export interface ExchangeTab {
  id: EXCHANGE;
  label: string;
  urlParam: ExchangeUrlParams;
  baseCurrencies: string[];
  activeBaseCurrency: string;
}
