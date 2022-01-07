export interface AllAverages {
  [key: string]: PairAverages;
}

export interface PairAverages {
  id: string;
  buy: Average;
  sell: Average;
}

export interface Average {
  money: number;
  volume: number;
  price: number;
}
