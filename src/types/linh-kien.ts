export type IQueryLinhKien = {
  page?: number;
  items_per_page?: number;
  keyword?: string;
};

export type IDataUng = {
  name?: string;
  id?: string;
  total?: number;
  _id?: string;
};

export type IUserCreate = {
  username: string;
  id: string;
};

export type ILinhKien = {
  _id?: string;
  name_linh_kien?: string;
  total?: number;
  create_date?: string;
  data_ung?: IDataUng[];
  user_create?: IUserCreate;
};

export type ILinhKienInfo = {
  name_linh_kien: string;
  total: number;
};

export type IDataLinhKien = {
  data: ILinhKien[];
  currentPage?: number;
  lastPage?: number;
  prevPage?: number;
  nextPage?: number;
  totalCount?: number;
};
