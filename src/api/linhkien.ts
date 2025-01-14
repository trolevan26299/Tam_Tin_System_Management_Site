import { useMemo } from 'react';
import { ILinhKienInfo } from 'src/types/linh-kien';
import axiosInstance, { endpoints, fetcher } from 'src/utils/axios';
import useSWR, { mutate } from 'swr';

const URL = endpoints.accessory;

export function useGetLinhKien() {
  const { data, isLoading, error, isValidating } = useSWR(`${URL}?is_all=true`, fetcher);

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
    await axiosInstance.post(`${URL}`, data);
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
    const data = await axiosInstance.delete(`${URL}/${id}`, {
      params: { passcode: passCode },
    });
    enqueueSnackbar(data?.data?.message, { variant: 'success' });
    mutate(URL);
  } catch (error) {
    enqueueSnackbar(error.error, { variant: 'error' });
    console.error('Failed to delete linh kien:', error);
  }
}
