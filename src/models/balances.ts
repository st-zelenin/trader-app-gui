export interface Balances {
  [key: string]: Balance;
}

export interface Balance {
  available: number;
  locked: number;
}
