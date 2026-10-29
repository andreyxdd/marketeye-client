import axios from 'axios';
import { IDateProps, IDataProps } from '../types';
import {
  BounceResult,
  BounceResultRequest,
  BounceSessionPage,
} from '../renderer/bounce/types';
import { throwApiError } from './apiError';

interface TransportOptions {
  baseUrl: string;
  apiKey: string;
  market: string;
  http?: Pick<typeof axios, 'get' | 'post'>;
}

export default class MarketEyeTransport {
  private readonly baseUrl: string;

  private readonly apiKey: string;

  private readonly market: string;

  private readonly http: Pick<typeof axios, 'get' | 'post'>;

  constructor(options: TransportOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.apiKey = options.apiKey;
    this.market = options.market;
    this.http = options.http ?? axios;
  }

  private async get(path: string, params: Record<string, unknown> = {}) {
    try {
      const response = await this.http.get(`${this.baseUrl}${path}`, {
        params: { ...params, api_key: this.apiKey },
      });
      return response.data;
    } catch (error) {
      return throwApiError(error);
    }
  }

  getTickerAnalytics(request: {
    date: string;
    ticker?: string;
    criterion?: string;
  }): Promise<IDataProps> {
    return this.get('/analytics/get_ticker_analytics', {
      date: request.date,
      ticker: request.ticker,
      criterion: request.criterion,
      market: this.market,
    });
  }

  getAnalyticsListsByCriteria(request: { date: string; price_band?: string }) {
    const params: Record<string, unknown> = {
      date: request.date,
      market: this.market,
    };
    if (request.price_band) params.price_band = request.price_band;
    return this.get('/analytics/get_analytics_lists_by_criteria', params);
  }

  async getAnalyticsListsByCriterion(request: {
    date: string;
    criterion?: string;
    price_band?: string;
  }): Promise<IDataProps[]> {
    const params: Record<string, unknown> = {
      date: request.date,
      criterion: request.criterion,
      market: this.market,
    };
    if (request.price_band) params.price_band = request.price_band;
    const data = await this.get(
      '/analytics/get_analytics_lists_by_criterion',
      params
    );
    return data[request.criterion as string];
  }

  getDates(): Promise<IDateProps[]> {
    return this.get('/analytics/get_dates', { market: this.market });
  }

  getMarketAnalytics(request: { date: string }) {
    return this.get('/analytics/get_market_analytics', { date: request.date });
  }

  async notifyDeveloper(request: { body: string; subject: string }) {
    try {
      await this.http.post(
        `${this.baseUrl}/notifications/notify_developer`,
        { email_body: request.body, email_subject: request.subject },
        {
          headers: { 'Content-Type': 'application/json; charset=UTF-8' },
          params: { api_key: this.apiKey },
        }
      );
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

  getBounceSessions(request: {
    cursor?: string;
    limit?: number;
  }): Promise<BounceSessionPage> {
    const params: Record<string, unknown> = {};
    if (request.cursor) params.cursor = request.cursor;
    if (request.limit) params.limit = request.limit;
    return this.get('/stock-bounce/v1/sessions', params);
  }

  getBounceResults(request: BounceResultRequest): Promise<BounceResult> {
    const params: Record<string, unknown> = {
      date: request.date,
      period: request.period,
      price_range: request.price_range,
    };
    if (request.tickers) params.tickers = request.tickers.join(',');
    return this.get('/stock-bounce/v1/results', params);
  }
}
