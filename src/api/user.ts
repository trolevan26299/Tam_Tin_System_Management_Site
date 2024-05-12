import axiosInstance, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------
export async function getUsers() {
  try {
    const res = await axiosInstance.post(endpoints.user.list);
    return res.data.dataRes;
  } catch (error) {
    return console.error(error);
  }
}

export async function getUserById(id: string) {
  try {
    const url = endpoints.user.details(id);
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    return console.error(error);
  }
}
