export type BouncePriceRange =
  | 'all'
  | '48to99_99'
  | '100to299_99'
  | '300to499_99'
  | '500to1000';

export interface BounceSession {
  epoch: number;
  date_string: string;
}

export interface BounceSessionPage {
  items: BounceSession[];
  next_cursor: string | null;
}

export interface BounceResultRequest {
  date: string;
  period: number;
  price_range: BouncePriceRange;
  tickers?: string[];
}

export interface BounceRow {
  id: number;
  ticker: string;
  open: number;
  close: number;
  volume: number;
  open_close_change_pct: number;
  frequencies: string;
}

export interface BounceResult {
  schema_version: 1;
  market: 'US';
  date: string;
  period: number;
  price_range: BouncePriceRange;
  rows: BounceRow[];
  missing_tickers: string[];
  coverage: 'exact' | 'degraded';
}

export interface BounceTransport {
  getBounceSessions(request: {
    cursor?: string;
    limit?: number;
  }): Promise<BounceSessionPage>;
  getBounceResults(request: BounceResultRequest): Promise<BounceResult>;
}
