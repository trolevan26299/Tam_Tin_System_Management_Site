// ----------------------------------------------------------------------

export type IProductFilterValue = string | string[] | number | number[];

export type IProductFilters = {
  rating: string;
  gender: string[];
  category: string;
  colors: string[];
  priceRange: number[];
};

// ----------------------------------------------------------------------

export type IProductReviewNewForm = {
  rating: number | null;
  review: string;
  name: string;
  email: string;
};

export type IProductReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  helpful: number;
  avatarUrl: string;
  isPurchased: boolean;
  attachments?: string[];
  postedAt: Date;
};

export type IProductItem = {
  id: string;
  sku: string;
  name: string;
  code: string;
  price: number;
  taxes: number;
  tags: string[];
  gender: string;
  sizes: string[];
  publish: string;
  coverUrl: string;
  images: string[];
  colors: string[];
  quantity: number;
  category: string;
  available: number;
  totalSold: number;
  description: string;
  totalRatings: number;
  totalReviews: number;
  inventoryType: string;
  subDescription: string;
  priceSale: number | null;
  reviews: IProductReview[];
  createdAt: Date;
  ratings: {
    name: string;
    starCount: number;
    reviewCount: number;
  }[];
  saleLabel: {
    enabled: boolean;
    content: string;
  };
  newLabel: {
    enabled: boolean;
    content: string;
  };
};

export type IStatusDevice = {
  status: string;
  quantity: number;
};

export type IDevice = {
  _id?: string;
  name: string;
  id_device: string;
  sub_category_id: string;
  price: number;
  note?: string;
  warranty: number;

  coverUrl?: string;
  status: IStatusDevice[];
};

export type IProductTableFilterValue = string | string[];

export type IProductTableFilters = {
  name: string;
  stock: string[];
  publish: string[];
  status: string;
};

export type IQueryDevice = {
  page?: number;
  items_per_page?: number;
  keyword?: string;
  belong_to?: string;
  status?: string;
};

export type IDataDevice = {
  data: IDevice[];
  currentPage?: number;
  lastPage?: number;
  prevPage?: number;
  nextPage?: number;
  totalCount?: number;
};
