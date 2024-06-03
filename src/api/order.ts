import { IQueryOrder } from 'src/types/order';
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
