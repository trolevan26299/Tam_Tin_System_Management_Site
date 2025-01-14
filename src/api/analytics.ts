import { IQueryAnalytics } from 'src/types/analytics';
import axiosInstance, { endpoints } from 'src/utils/axios';

export async function getAnalytics(query?: IQueryAnalytics) {
  try {
    const res = await axiosInstance.get(endpoints.analytics.list, {
      params: query,
    });
    return res.data;
  } catch (error) {
    return console.error(error);
  }
}
