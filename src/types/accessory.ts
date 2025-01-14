export type IAccessory = {
  _id?: string;
  name_linh_kien?: string;
  total?: number;
  create_date?: string;
  user_create?: {
    username?: string;
    id?: string;
  };
  data_ung?: {
    id?: string;
    name?: string;
    total?: number;
  }[];
};
