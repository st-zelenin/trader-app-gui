import { EXCHANGE, EXCHANGE_URL_PARAMS } from '../constants';

export interface ExchangeTab {
  id: EXCHANGE;
  label: string;
  urlParam: EXCHANGE_URL_PARAMS;
  baseCurrencies: string[];
  activeBaseCurrency: string;
}
