export interface Tickers {
  [key: string]: Ticker;
}

export interface Ticker {
  last: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  change_percentage: number;
}
