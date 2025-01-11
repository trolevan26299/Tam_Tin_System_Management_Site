export type IQueryLinhKien = {
  page?: number;
  items_per_page?: number;
  keyword?: string;
};

export type IDataLinhKien = {
  data: ILinhKien[];
  currentPage?: number;
  lastPage?: number;
  prevPage?: number;
  nextPage?: number;
  totalCount?: number;
};
