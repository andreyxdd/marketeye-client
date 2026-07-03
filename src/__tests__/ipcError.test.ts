import { AxiosError } from 'axios';
import { throwApiError, toApiError } from '../main/apiError';

describe('toApiError', () => {
  it('maps axios HTTP errors to serializable payloads', () => {
    const error = {
      isAxiosError: true,
      message: 'Request failed with status code 503',
      response: {
        status: 503,
        data: { detail: 'Service unavailable' },
      },
    } as AxiosError;

    expect(toApiError(error)).toEqual({
      code: 'HTTP_503',
      status: 503,
      message: 'Service unavailable',
    });
  });

  it('maps network axios errors without status', () => {
    const error = {
      isAxiosError: true,
      message: 'Network Error',
    } as AxiosError;

    expect(toApiError(error)).toEqual({
      code: 'NETWORK_ERROR',
      message: 'Network Error',
    });
  });

  it('maps generic errors', () => {
    expect(toApiError(new Error('boom'))).toEqual({
      code: 'UNKNOWN_ERROR',
      message: 'boom',
    });
  });
});

describe('throwApiError', () => {
  it('throws an error with serializable code, status, and message', () => {
    const error = {
      isAxiosError: true,
      message: 'Request failed with status code 500',
      response: {
        status: 500,
        data: 'Internal error',
      },
    } as AxiosError;

    expect(() => throwApiError(error)).toThrow(
      expect.objectContaining({
        code: 'HTTP_500',
        status: 500,
        message: 'Internal error',
      })
    );
  });
});
