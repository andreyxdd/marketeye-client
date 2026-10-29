import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  BouncePriceRange,
  BounceResult,
  BounceResultRequest,
  BounceSession,
  BounceTransport,
} from './types';

interface OriginScreen {
  date: string;
  period: number;
  priceRange: BouncePriceRange;
  tickers: string[];
}

interface WorkflowState {
  selectedDate: string | null;
  period: number;
  priceRange: BouncePriceRange;
  mode: 'screen' | 'tracking';
  trackingDate: string | null;
  origin: OriginScreen | null;
}

type Action =
  | { type: 'initialize'; date: string }
  | { type: 'date'; date: string }
  | { type: 'period'; period: number }
  | { type: 'price-range'; priceRange: BouncePriceRange }
  | { type: 'track'; date: string; origin: OriginScreen }
  | { type: 'screen' };

const initialState: WorkflowState = {
  selectedDate: null,
  period: 1,
  priceRange: 'all',
  mode: 'screen',
  trackingDate: null,
  origin: null,
};

export function bounceWorkflowReducer(
  state: WorkflowState,
  action: Action
): WorkflowState {
  switch (action.type) {
    case 'initialize':
      return state.selectedDate
        ? state
        : { ...state, selectedDate: action.date };
    case 'date':
      return {
        ...state,
        selectedDate: action.date,
        mode: 'screen',
        trackingDate: null,
        origin: null,
      };
    case 'period':
      return { ...state, period: action.period, mode: 'screen', origin: null };
    case 'price-range':
      return {
        ...state,
        priceRange: action.priceRange,
        mode: 'screen',
        origin: null,
      };
    case 'track':
      return {
        ...state,
        mode: 'tracking',
        trackingDate: action.date,
        origin: action.origin,
      };
    case 'screen':
      return {
        ...state,
        selectedDate: state.origin?.date ?? state.selectedDate,
        period: state.origin?.period ?? state.period,
        priceRange: state.origin?.priceRange ?? state.priceRange,
        mode: 'screen',
        trackingDate: null,
        origin: null,
      };
    default:
      return state;
  }
}

export interface BounceWorkflow {
  sessions: BounceSession[];
  sessionsLoading: boolean;
  sessionsError: unknown;
  retrySessions: () => void;
  selectedDate: string | null;
  period: number;
  priceRange: BouncePriceRange;
  mode: 'screen' | 'tracking';
  trackingDate: string | null;
  result: BounceResult | undefined;
  resultLoading: boolean;
  resultError: unknown;
  retryResult: () => void;
  trackingAvailability: Record<number, boolean>;
  selectDate: (date: string) => void;
  setPeriod: (period: number) => void;
  setPriceRange: (range: BouncePriceRange) => void;
  track: (offset: number) => void;
  returnToScreen: () => void;
}

export default function useBounceWorkflow(
  transport: BounceTransport = window.electronAPI
): BounceWorkflow {
  const [state, dispatch] = useReducer(bounceWorkflowReducer, initialState);
  const sessionQuery = useInfiniteQuery(
    ['stock-bounce', 'sessions'],
    ({ pageParam }) =>
      transport.getBounceSessions({ cursor: pageParam, limit: 500 }),
    {
      getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
      staleTime: Infinity,
    }
  );

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = sessionQuery;
  useEffect(() => {
    if (!sessionQuery.error && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [sessionQuery.error, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sessions = useMemo(
    () => sessionQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [sessionQuery.data]
  );
  const sessionsLoading =
    !sessionQuery.error &&
    (sessionQuery.isLoading ||
      sessionQuery.isFetchingNextPage ||
      Boolean(sessionQuery.hasNextPage));

  useEffect(() => {
    if (
      !sessionsLoading &&
      !sessionQuery.error &&
      sessions.length &&
      !state.selectedDate
    ) {
      dispatch({
        type: 'initialize',
        date: sessions[sessions.length - 1].date_string,
      });
    }
  }, [sessionsLoading, sessionQuery.error, sessions, state.selectedDate]);

  const originDate = state.origin?.date ?? state.selectedDate;
  const originIndex = sessions.findIndex(
    (item) => item.date_string === originDate
  );
  const request = useMemo<BounceResultRequest | null>(() => {
    if (state.mode === 'tracking' && state.origin && state.trackingDate) {
      return {
        date: state.trackingDate,
        period: state.origin.period,
        price_range: state.origin.priceRange,
        tickers: state.origin.tickers,
      };
    }
    if (!state.selectedDate) return null;
    return {
      date: state.selectedDate,
      period: state.period,
      price_range: state.priceRange,
    };
  }, [state]);

  const resultQuery = useQuery(
    ['stock-bounce', 'results', request],
    () => transport.getBounceResults(request as BounceResultRequest),
    { enabled: Boolean(request) && !sessionsLoading, staleTime: Infinity }
  );
  const hasTrackingRows = state.origin
    ? state.origin.tickers.length > 0
    : Boolean(resultQuery.data?.rows.length);
  const trackingAvailability = [0, 1, 2].reduce<Record<number, boolean>>(
    (availability, offset) => {
      availability[offset] =
        hasTrackingRows &&
        originIndex >= 0 &&
        Boolean(sessions[originIndex + offset]);
      return availability;
    },
    {}
  );

  const selectDate = useCallback((date: string) => {
    dispatch({ type: 'date', date });
  }, []);
  const setPeriod = useCallback((period: number) => {
    dispatch({ type: 'period', period });
  }, []);
  const setPriceRange = useCallback((priceRange: BouncePriceRange) => {
    dispatch({ type: 'price-range', priceRange });
  }, []);
  const track = useCallback(
    (offset: number) => {
      if (!trackingAvailability[offset] || originIndex < 0) return;
      const trackingDate = sessions[originIndex + offset].date_string;
      const origin: OriginScreen = state.origin ?? {
        date: state.selectedDate as string,
        period: state.period,
        priceRange: state.priceRange,
        tickers: resultQuery.data?.rows.map((row) => row.ticker) ?? [],
      };
      if (!origin.tickers.length) return;
      dispatch({ type: 'track', date: trackingDate, origin });
    },
    [
      trackingAvailability,
      originIndex,
      sessions,
      state.origin,
      state.selectedDate,
      state.period,
      state.priceRange,
      resultQuery.data,
    ]
  );
  const returnToScreen = useCallback(() => dispatch({ type: 'screen' }), []);

  return {
    sessions,
    sessionsLoading,
    sessionsError: sessionQuery.error,
    retrySessions: sessionQuery.refetch,
    selectedDate: state.selectedDate,
    period: state.period,
    priceRange: state.priceRange,
    mode: state.mode,
    trackingDate: state.trackingDate,
    result: resultQuery.data,
    resultLoading:
      Boolean(request) && (resultQuery.isLoading || resultQuery.isFetching),
    resultError: resultQuery.error,
    retryResult: resultQuery.refetch,
    trackingAvailability,
    selectDate,
    setPeriod,
    setPriceRange,
    track,
    returnToScreen,
  };
}
