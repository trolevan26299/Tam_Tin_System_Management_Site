export type IQueryAnalytics = {
  from_date?: string;
  to_date?: string;
};

export type IAnalyTicsDto = {
  orderCount?: number;
  revenue?: number;
  profit?: number;
  newCustomerCount?: number;
};
