import axios, { AxiosError } from 'axios';

export type ApiErrorPayload = {
  code: string;
  status?: number;
  message: string;
};

function messageFromResponseData(data: unknown): string | undefined {
  if (typeof data === 'string' && data.trim()) {
    return data;
  }
  if (typeof data === 'object' && data !== null) {
    const record = data as Record<string, unknown>;
    if (typeof record.detail === 'string' && record.detail.trim()) {
      return record.detail;
    }
    if (typeof record.message === 'string' && record.message.trim()) {
      return record.message;
    }
  }
  return undefined;
}

export function toApiError(error: unknown): ApiErrorPayload {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const responseMessage = messageFromResponseData(axiosError.response?.data);

    return {
      code: status ? `HTTP_${status}` : 'NETWORK_ERROR',
      status,
      message: responseMessage ?? axiosError.message,
    };
  }

  if (error instanceof Error) {
    return { code: 'UNKNOWN_ERROR', message: error.message };
  }

  return { code: 'UNKNOWN_ERROR', message: String(error) };
}

export function throwApiError(error: unknown): never {
  const payload = toApiError(error);
  throw Object.assign(new Error(payload.message), payload);
}
