export type IStaff = {
  _id?: string;
  name: string;
  address?: string;
  age?: number;
  salary?: number;
  position?: string;
  exp?: number;
  phone?: string;
  linh_kien_ung?: Array<{
    name_linh_kien: string;
    total: number;
  }>;
  username_telegram?: string;
  user_id_telegram?: string;
  note?: string;
};

export type IQueryStaff = {
  page?: number;
  items_per_page?: number;
  keyword?: string;
  is_all?: boolean;
};

export type IDataStaff = {
  data: IStaff[];
  currentPage?: number;
  lastPage?: number;
  prevPage?: number;
  nextPage?: number;
  totalCount?: number;
};

export type IPropRow = {
  selected: boolean;
  onEditRow: VoidFunction;
  row: IStaff;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};
