export type ICategory = {
  _id?: string;
  name: string;
};

export type ISubCategory = {
  _id?: string;
  name: string;
  number_of_device: number;
  category_id: string;
};

export type ICategoryTableFilters = {
  name: string;
};

export type IQueryCategory = {
  page?: number;
  items_per_page?: number;
  keyword?: string;
};

export type IDataCategory = {
  data: ICategory[];
  currentPage?: number;
  lastPage?: number;
  prevPage?: number;
  nextPage?: number;
  totalCount?: number;
};

export type IDataSubCategory = {
  data: ISubCategory[];
  currentPage?: number;
  lastPage?: number;
  prevPage?: number;
  nextPage?: number;
  totalCount?: number;
};
