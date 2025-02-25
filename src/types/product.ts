export type IDetailDevice = {
  status: string;
  id_device: string;
  deviceInfo: IDeviceInfo;
};

export type IHistoryRepairItem = {
  id: string;
  name?: string;
  total?: number;
};

export type IHistoryRepair = {
  type_repair?: string;
  date_repair?: string;
  linh_kien?: IHistoryRepairItem[];
  staff_repair?: string;
  note?: string;
};
export type IDeviceInfo = {
  _id: string;
  name: string;
  id_device: string;
  status: string;
  history_repair?: IHistoryRepair[];
  date_buy?: string;
  warranty?: number;
  name_customer?: string;
  type_customer?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
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
  subCategoryId?: string;
};

export type IDataDevice = {
  data: IDevice[];
  currentPage?: number;
  lastPage?: number;
  prevPage?: number;
  nextPage?: number;
  totalCount?: number;
};
