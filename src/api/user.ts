/* eslint-disable import/no-cycle */
import axiosInstance, { endpoints } from 'src/utils/axios';
import { userInfo } from 'src/sections/user/user-info';

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

export async function createUser(body: userInfo) {
  try {
    const res = await axiosInstance.post(endpoints.user.create, body);
    return res.data;
  } catch (error) {
    return console.error(error);
  }
}

export async function updateUserById(id: string, body: userInfo) {
  try {
    const url = endpoints.user.update(id);
    const res = await axiosInstance.put(url, body);
    return res.data;
  } catch (error) {
    console.error(error);
    return error.status;
  }
}
