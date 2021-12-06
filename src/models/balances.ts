export interface Balances {
  [key: string]: Balance;
}

export interface Balance {
  available: string;
  locked: string;
}
