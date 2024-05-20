import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';
// types
import { IDevice } from 'src/types/product';

// ----------------------------------------------------------------------

export async function getListDevice() {
  try {
    const res = await axiosInstance.post(endpoints.device.list);
    return res.data.dataRes;
  } catch (error) {
    return console.error(error);
  }
}
