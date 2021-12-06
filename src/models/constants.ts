import { environment } from '../environments/environment';
import { Multiplicator } from './multiplicator';

export const API_URL = environment.API_URL;

export const BUY_MULTIPLICATORS: Multiplicator[] = [
  { text: '0.5 %', value: 0.005 },
  { text: '1 %', value: 0.01 },
  { text: '5 %', value: 0.05 },
  { text: '10 %', value: 0.1 },
];
