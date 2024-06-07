/* eslint-disable import/no-cycle */
import { userInfo } from 'src/sections/user/user-info';
import { IQueryUser } from 'src/types/user';
import axiosInstance, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------
export async function getUsers(query?: IQueryUser) {
  try {
    const res = await axiosInstance.get(endpoints.user.list, {
      params: query,
    });
    return res.data;
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

export async function deleteUserById(id: string) {
  try {
    const url = endpoints.user.delete(id);
    const res = await axiosInstance.delete(url);
    return res.data;
  } catch (error) {
    console.error(error);
    return error.status;
  }
}
