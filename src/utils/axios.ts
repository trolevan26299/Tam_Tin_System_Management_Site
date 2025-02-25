import axios, { AxiosRequestConfig } from 'axios';
// config
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: '/api'
});
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/chat',
  kanban: '/kanban',
  calendar: '/calendar',
  auth: {
    me: '/auth/me',
    login: '/auth/login',
  },
  user: {
    list: '/account/list',
    create: '/account',
    details: (userId: string) => `/account/${userId}`,
    update: (userId: string) => `/account/${userId}`,
    delete: (userId: string) => `/account/${userId}`,
  },
  mail: {
    list: '/mail/list',
    details: '/mail/details',
    labels: '/mail/labels',
  },
  post: {
    list: '/post/list',
    details: '/post/details',
    latest: '/post/latest',
    search: '/post/search',
  },
  device: {
    list: '/device/list',
    details: (deviceId: string) => `/device/${deviceId}`,
    create: '/device',
    update: (deviceId: string) => `/device/${deviceId}`,
    delete: (deviceId: string) => `/device/${deviceId}`,
    deleteByDeviceId: (deviceId: string) => `/device/delete-by-device-id/${deviceId}`,
  },
  category: {
    list: '/category/list',
    details: (categoryId: string) => `/category/${categoryId}`,
    create: '/category',
    update: (categoryId: string) => `/category/${categoryId}`,
    delete: (categoryId: string) => `/category/${categoryId}`,
  },
  subCategory: {
    list: '/sub-category/list',
    details: (subCategoryId: string) => `/sub-category/${subCategoryId}`,
    create: '/sub-category',
    update: (subCategoryId: string) => `/sub-category/${subCategoryId}`,
    delete: (subCategoryId: string) => `/sub-category/${subCategoryId}`,
  },
  customer: {
    list: '/customer/list',
    details: (customerId: string) => `/customer/${customerId}`,
    create: '/customer',
    update: (customerId: string) => `/customer/${customerId}`,
    delete: (customerId: string) => `/customer/${customerId}`,
  },
  order: {
    create: '/order',
    list: '/order/list',
    details: (orderId: string) => `/order/${orderId}`,
    update: (orderId: string) => `/order/${orderId}`,
    delete: (orderId: string) => `/order/${orderId}`,
  },
  staff: {
    create: '/staff',
    list: '/staff/list',
    details: (staffId: string) => `/staff/${staffId}`,
    update: (staffId: string) => `/staff/${staffId}`,
    delete: (staffId: string) => `/staff/${staffId}`,
  },
  analytics: {
    list: '/analytics',
  },
  linhKien: {
    list: '/linh-kien?is_all=true',
    default: '/linh-kien',
    transaction: '/transaction-linh-kien',
  },
};
