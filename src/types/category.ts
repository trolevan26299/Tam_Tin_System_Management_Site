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
