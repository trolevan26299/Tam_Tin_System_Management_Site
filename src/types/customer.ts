export type ICustomer = {
  _id?: string;
  name: string;
  address: string;
  phone: string;
  type: string;
  email: string;
  note?: string;

  avatarUrl?: string;
};

export type ICustomerTableFilters = {
  name: string;
};

export type IQueryCustomer = {
  page?: number;
  items_per_page?: number;
  keyword?: string;
  from_date?: string;
  to_date?: string;
};

export type IDataCustomer = {
  data: ICustomer[];
  currentPage?: number;
  lastPage?: number;
  prevPage?: number;
  nextPage?: number;
  totalCount?: number;
};
