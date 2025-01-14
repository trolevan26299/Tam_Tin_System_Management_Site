import axios, { AxiosRequestConfig } from 'axios';
// config
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

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
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    login: '/api/auth/login',
  },
  user: {
    list: '/api/account/list',
    create: '/api/account',
    details: (userId: string) => `/api/account/${userId}`,
    update: (userId: string) => `/api/account/${userId}`,
    delete: (userId: string) => `/api/account/${userId}`,
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  device: {
    list: '/api/device/list',
    details: (deviceId: string) => `/api/device/${deviceId}`,
    create: '/api/device',
    update: (deviceId: string) => `/api/device/${deviceId}`,
    delete: (deviceId: string) => `api/device/${deviceId}`,
  },
  category: {
    list: '/api/category/list',
    details: (categoryId: string) => `/api/category/${categoryId}`,
    create: '/api/category',
    update: (categoryId: string) => `/api/category/${categoryId}`,
    delete: (categoryId: string) => `api/category/${categoryId}`,
  },
  subCategory: {
    list: '/api/sub-category/list',
    details: (subCategoryId: string) => `/api/sub-category/${subCategoryId}`,
    create: '/api/sub-category',
    update: (subCategoryId: string) => `/api/sub-category/${subCategoryId}`,
    delete: (subCategoryId: string) => `api/sub-category/${subCategoryId}`,
  },
  customer: {
    list: '/api/customer/list',
    details: (customerId: string) => `/api/customer/${customerId}`,
    create: '/api/customer',
    update: (customerId: string) => `/api/customer/${customerId}`,
    delete: (customerId: string) => `api/customer/${customerId}`,
  },
  order: {
    create: '/api/order',
    list: '/api/order/list',
    details: (orderId: string) => `/api/order/${orderId}`,
    update: (orderId: string) => `/api/order/${orderId}`,
    delete: (orderId: string) => `api/order/${orderId}`,
  },
  staff: {
    create: '/api/staff',
    list: '/api/staff/list',
    details: (staffId: string) => `/api/staff/${staffId}`,
    update: (staffId: string) => `/api/staff/${staffId}`,
    delete: (staffId: string) => `api/staff/${staffId}`,
  },
  analytics: {
    list: '/api/analytics',
  },
  linhKien: {
    list: '/api/linh-kien?is_all=true',
    default: '/api/linh-kien',
  },
};
