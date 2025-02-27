// ----------------------------------------------------------------------

import { ICustomer } from './customer';
import { IDevice } from './product';

export type IOrderTableFilterValue = string | Date | null;

export type IOrderTableFilters = {
  name: string;
};
// export type IOrderTableFilters = {
//   name: string;
//   status: string;
//   startDate: Date | null;
//   endDate: Date | null;
//   order: string;
// };

// ----------------------------------------------------------------------

export type IOrderHistory = {
  orderTime: Date;
  paymentTime: Date;
  deliveryTime: Date;
  completionTime: Date;
  timeline: {
    title: string;
    time: Date;
  }[];
};

export type IOrderShippingAddress = {
  fullAddress: string;
  phoneNumber: string;
};

export type IOrderPayment = {
  cardType: string;
  cardNumber: string;
};

export type IOrderDelivery = {
  shipBy: string;
  speedy: string;
  trackingNumber: string;
};

export type IOrderCustomer = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  ipAddress: string;
};

export type IOrderProductItem = {
  id: string;
  sku: string;
  name: string;
  price: number;
  coverUrl: string;
  quantity: number;
};

export type IOrderItem = {
  id: string;
  taxes: number;
  status: string;
  shipping: number;
  discount: number;
  subTotal: number;
  orderNumber: string;
  totalAmount: number;
  totalQuantity: number;
  history: IOrderHistory;
  customer: IOrderCustomer;
  delivery: IOrderDelivery;
  items: IOrderProductItem[];
  createdAt: Date;
};

export type Items = {
  device?: IDevice & { coverUrl?: string; sku?: string };
  details?: string[];
  price?: number;
  warranty?: number;
};

export type IOrder = {
  _id?: string;
  note?: string;
  totalAmount?: number;
  priceSaleOff?: number;
  type_customer?: string;
  delivery_date: string;
  shipBy?: string;
  customer?: ICustomer;
  items?: Items[];

  regDt?: string;
};

export type IOrderCreateOrUpdate = {
  _id?: string;
  note?: string;
  totalAmount: number;
  type_customer: string;
  delivery_date: string;
  customer: string;
  shipBy: string;
  items: {
    device: string;
    details?: string[];
    price: number;
    warranty: number;
  }[];

  priceSaleOff?: number;
};

export type IQueryOrder = {
  page?: number;
  items_per_page?: number;
  keyword?: string;
  from_date?: string;
  to_date?: string;
  customerId?: string;
};

export type IDataOrder = {
  data: IOrder[];
  currentPage?: number;
  lastPage?: number;
  prevPage?: number;
  nextPage?: number;
  totalCount?: number;
};
