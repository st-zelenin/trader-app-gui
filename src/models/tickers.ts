export interface Tickers {
  [key: string]: Ticker;
}

export interface Ticker {
  last: number;
  change_percentage: number;
}
