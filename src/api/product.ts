// utils
import axiosInstance, { endpoints } from 'src/utils/axios';
// types
import { IDevice, IQueryDevice } from 'src/types/product';

// ----------------------------------------------------------------------

export async function getListDevice(query?: IQueryDevice) {
  try {
    const res = await axiosInstance.get(endpoints.device.list, { params: query });
    return res.data;
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

export async function deleteDeviceByDeviceId(id: string, enqueueSnackbar: (message: string, options?: object) => void) {
  try {

    const url = endpoints.device.deleteByDeviceId(id);
    await axiosInstance.delete(url);

    enqueueSnackbar('Xóa thiết bị thành công', { variant: 'success' });
  } catch (error) {
    console.error('Lỗi khi xóa thiết bị:', error);
  }
}
