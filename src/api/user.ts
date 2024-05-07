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
