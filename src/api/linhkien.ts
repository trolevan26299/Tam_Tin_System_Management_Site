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

export async function createLinhKien(
  data: ILinhKienInfo,
  enqueueSnackbar: (message: string, options?: object) => void
) {
  try {
    await axiosInstance.post(`${endpoints.linhKien.default}`, data);
    enqueueSnackbar('Tạo linh kiện thành công !', { variant: 'success' });
    mutate(URL);
  } catch (error) {
    enqueueSnackbar(error.error, { variant: 'error' });
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

export async function getLinhKienTransactionBy(query: IQueryLinhKien) {
  try {
    const res = await axiosInstance.get(URL_TRANSACTION, { params: query });
    return res.data;
  } catch (error) {
    return console.error(error);
  }
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
    const res = await axiosInstance.post(`${endpoints.linhKien.transaction}`, data);
    enqueueSnackbar('Tạo mới thành công!', { variant: 'success' });
    return res.data;
  } catch (error) {
    enqueueSnackbar(error.error, { variant: 'error' });
    return console.error(error);
  }
}

export async function updateTransactionLinhKien(
  data: ILinhKienTransaction,
  enqueueSnackbar: (message: string, options?: object) => void
) {
  try {
    const res = await axiosInstance.put(`${endpoints.linhKien.transaction}/${data._id}`, data);
    enqueueSnackbar('Cập nhật thành công!', { variant: 'success' });
    return res.data;
  } catch (error) {
    enqueueSnackbar(error.error, { variant: 'error' });
    return console.error(error);
  }
}
