/* eslint-disable @typescript-eslint/naming-convention */
export interface GateIoCurrencyPair {
  id: string;
  base: string;
  quote: string;
  fee: string;
  min_quote_amount: string;
  amount_precision: string;
  precision: string;
  trade_status: string;
}
