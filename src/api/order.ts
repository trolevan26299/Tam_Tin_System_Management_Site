import { IOrderCreateOrUpdate, IQueryOrder } from 'src/types/order';
import axiosInstance, { endpoints } from 'src/utils/axios';

export async function getListOrder(query?: IQueryOrder) {
  try {
    const res = await axiosInstance.get(endpoints.order.list, {
      params: query,
    });
    return res.data.data;
  } catch (error) {
    return console.error(error);
  }
}

export async function createOrder(
  body: IOrderCreateOrUpdate,
  enqueueSnackbar: (message: string, options?: object) => void
) {
  try {
    const res = await axiosInstance.post(endpoints.order.create, body);
    return res.data;
  } catch (error) {
    enqueueSnackbar(error.error, { variant: 'error' });
    return console.error(error);
  }
}

export async function updateOrderById(
  id: string,
  body: IOrderCreateOrUpdate,
  enqueueSnackbar: (message: string, options?: object) => void
) {
  try {
    const url = endpoints.order.update(id);
    const res = await axiosInstance.put(url, body);
    return res.data;
  } catch (error) {
    enqueueSnackbar(error.error, { variant: 'error' });
    return console.error(error);
  }
}

export async function getOrderById(id: string) {
  try {
    const url = endpoints.order.details(id);
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    return console.error(error);
  }
}

export async function deleteOrderById(id: string) {
  try {
    const url = endpoints.order.delete(id);
    const res = await axiosInstance.delete(url);
    return res.data;
  } catch (error) {
    console.error(error);
    return error.status;
  }
}
