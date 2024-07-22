import { ICustomer, IQueryCustomer } from 'src/types/customer';
import axiosInstance, { endpoints } from 'src/utils/axios';

export async function getListCustomer(query?: IQueryCustomer) {
  try {
    const res = await axiosInstance.get(endpoints.customer.list, {
      params: query,
    });
    return res.data;
  } catch (error) {
    return console.error(error);
  }
}

export async function getCustomerById(id: string) {
  try {
    const url = endpoints.customer.details(id);
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    return console.error(error);
  }
}

export async function createCustomer(
  body: ICustomer,
  enqueueSnackbar: (message: string, options?: object) => void
) {
  try {
    const res = await axiosInstance.post(endpoints.customer.create, body);
    return res.data;
  } catch (error) {
    enqueueSnackbar(error.error, { variant: 'error' });
    return console.error(error);
  }
}

export async function updateCustomerById(
  id: string,
  body: ICustomer,
  enqueueSnackbar: (message: string, options?: object) => void
) {
  try {
    const url = endpoints.customer.update(id);
    const res = await axiosInstance.put(url, body);
    return res.data;
  } catch (error) {
    enqueueSnackbar(error.error, { variant: 'error' });
    return console.error(error);
  }
}

export async function deleteCustomerById(id: string) {
  try {
    const url = endpoints.customer.delete(id);
    const res = await axiosInstance.delete(url);
    return res.data;
  } catch (error) {
    console.error(error);
    return error.status;
  }
}
