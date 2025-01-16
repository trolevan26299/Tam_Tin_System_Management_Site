import { useMemo } from 'react';
import { ILinhKienInfo, ILinhKienTransaction, IQueryLinhKien } from 'src/types/linh-kien';
import axiosInstance, { endpoints, fetcher } from 'src/utils/axios';
import useSWR, { mutate } from 'swr';

const URL = endpoints.linhKien.list;

export function useGetLinhKien() {
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      data: data?.data,
      isLoading,
      error,
      isValidating,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function createLinhKien(data: ILinhKienInfo) {
  try {
    await axiosInstance.post(`${endpoints.linhKien.default}`, data);
    mutate(URL);
  } catch (error) {
    console.error('Failed to create linh kien:', error);
  }
}

export async function deleteLinhKien(
  id: string,
  passCode: number,
  enqueueSnackbar: (message: string, options?: object) => void
) {
  try {
    const data = await axiosInstance.delete(`${endpoints.linhKien.default}/${id}`, {
      params: { passcode: passCode },
    });
    enqueueSnackbar(data?.data?.message, { variant: 'success' });
    mutate(URL);
  } catch (error) {
    enqueueSnackbar(error.error, { variant: 'error' });
    console.error('Failed to delete linh kien:', error);
  }
}

// transaction
const URL_TRANSACTION = endpoints.linhKien.transaction;

export async function getLinhKienByName(params: IQueryLinhKien) {
  try {
    const res = await axiosInstance.get(URL, { params });
    return res.data;
  } catch (error) {
    return console.error(error);
  }
}

export function useGetLinhKienTransaction(query: IQueryLinhKien) {
  const usp = new URLSearchParams(query as any);

  const { data, isLoading, error, isValidating } = useSWR(`${URL_TRANSACTION}?${usp}`, fetcher);

  const memoizedValue = useMemo(
    () => ({
      data,
      isLoading,
      error,
      isValidating,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function getLinhKienTransactionById(id: string) {
  try {
    const res = await axiosInstance.get(`${URL_TRANSACTION}/${id}`);
    return res.data;
  } catch (error) {
    return console.error(error);
  }
}

export async function createTransactionLinhKien(
  data: ILinhKienTransaction,
  enqueueSnackbar: (message: string, options?: object) => void
) {
  try {
    const res = await axiosInstance.post(`${endpoints.linhKien.default}`, data);
    enqueueSnackbar(res?.data?.message, { variant: 'success' });
    return res.data;
    // mutate(URL_TRANSACTION);
  } catch (error) {
    enqueueSnackbar(error.error, { variant: 'error' });
    return console.error(error);
  }
}
