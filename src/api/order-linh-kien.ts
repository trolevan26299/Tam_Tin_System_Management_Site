import {
  ICreateOrderLinhKienDto,
  IOrderLinhKien,
  IOrderLinhKienListResponse,
  IQueryOrderLinhKienDto,
  IUpdateOrderLinhKienDto,
} from 'src/types/order-linh-kien';
import { SnackbarKey, OptionsObject, SnackbarMessage } from 'notistack';
import axiosInstance from 'src/utils/axios';

export const getListOrderLinhKien = async (params: IQueryOrderLinhKienDto) => {
  const response = await axiosInstance.get('/order-linh-kien', { params });
  return response.data;
};

export const getOrderLinhKienById = async (id: string): Promise<IOrderLinhKien> => {
  const response = await axiosInstance.get(`/order-linh-kien/${id}`);
  return response.data;
};

export const createOrderLinhKien = async (
  data: ICreateOrderLinhKienDto
): Promise<IOrderLinhKien | null> => {
  const response = await axiosInstance.post('/order-linh-kien', data);
  return response.data;
};

export const updateOrderLinhKien = async (
  id: string,
  data: IUpdateOrderLinhKienDto
): Promise<IOrderLinhKien | null> => {
  const response = await axiosInstance.patch(`/order-linh-kien/${id}`, data);
  return response.data;
};

export const deleteOrderLinhKien = async (
  id: string,
  enqueueSnackbar?: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey
): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/order-linh-kien/${id}`);
    return true;
  } catch (error: any) {
    if (enqueueSnackbar) {
      enqueueSnackbar(error.message || 'Có lỗi xảy ra khi xóa đơn hàng', {
        variant: 'error',
      });
    }
    return false;
  }
};
