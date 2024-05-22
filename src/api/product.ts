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

export async function getListCategory() {
  try {
    const res = await axiosInstance.get(endpoints.category.list);
    return res.data.data;
  } catch (error) {
    return console.error(error);
  }
}

export async function getDeviceById(id: string) {
  try {
    const url = endpoints.device.details(id);
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    return console.error(error);
  }
}

export async function createDevice(body: IDevice) {
  try {
    const res = await axiosInstance.post(endpoints.device.create, body);
    return res.data;
  } catch (error) {
    return console.error(error);
  }
}

export async function updateDeviceById(id: string, body: IDevice) {
  try {
    const url = endpoints.device.update(id);
    const res = await axiosInstance.put(url, body);
    return res.data;
  } catch (error) {
    console.error(error);
    return error.status;
  }
}

export async function deleteDeviceById(id: string) {
  try {
    const url = endpoints.device.delete(id);
    const res = await axiosInstance.delete(url);
    return res.data;
  } catch (error) {
    console.error(error);
    return error.status;
  }
}
