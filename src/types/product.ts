export type IDetailDevice = {
  status: string;
  id_device: string;
};

export type IDevice = {
  _id?: string;
  name: string;
  sub_category_id: string;
  quantity: number;
  cost: number;
  note?: string;
  detail?: IDetailDevice[];
};

export type IProductTableFilterValue = string | string[];

export type IProductTableFilters = {
  name: string;
  stock: string[];
  publish: string[];
};

export type IQueryDevice = {
  page?: number;
  items_per_page?: number;
  keyword?: string;
  belong_to?: string;
};

export type IDataDevice = {
  data: IDevice[];
  currentPage?: number;
  lastPage?: number;
  prevPage?: number;
  nextPage?: number;
  totalCount?: number;
};
