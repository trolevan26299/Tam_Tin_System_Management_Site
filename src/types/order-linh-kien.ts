export interface ILinhKienInfo {
  _id: string;
  name_linh_kien: string;
  total: number;
  create_date?: string;
}

export interface ICustomerInfo {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface IOrderLinhKien {
  _id: string;
  id_linh_kien: ILinhKienInfo;
  so_luong: number;
  id_khach_hang: ICustomerInfo;
  ghi_chu?: string;
  tong_tien: number;
  ngay_tao: string;
  ngay_cap_nhat?: string;
}

export interface IOrderLinhKienListResponse {
  data: IOrderLinhKien[];
  totalCount: number;
  currentPage: number;
  lastPage: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface ICreateOrderLinhKienDto {
  id_linh_kien: string;
  so_luong: number;
  id_khach_hang: string;
  ghi_chu?: string;
  tong_tien: number;
}

export interface IUpdateOrderLinhKienDto {
  id_linh_kien?: string;
  so_luong?: number;
  id_khach_hang?: string;
  ghi_chu?: string;
  tong_tien?: number;
}

export interface IQueryOrderLinhKienDto {
  keyword?: string;
  from_date?: string;
  to_date?: string;
  id_khach_hang?: string;
  page?: number;
  items_per_page?: number;
  is_all?: boolean;
}
