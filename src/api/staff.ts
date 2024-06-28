/* eslint-disable import/no-cycle */
import { IQueryStaff, IStaff } from 'src/types/staff';
import axiosInstance, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------
export async function getStaffs(query?: IQueryStaff) {
  try {
    const res = await axiosInstance.get(endpoints.staff.list, {
      params: query,
    });
    return res.data;
  } catch (error) {
    return console.error(error);
  }
}

export async function getStaffById(id: string) {
  try {
    const url = endpoints.staff.details(id);
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    return console.error(error);
  }
}

export async function createStaff(body: IStaff) {
  try {
    const res = await axiosInstance.post(endpoints.staff.create, body);
    return res.data;
  } catch (error) {
    return console.error(error);
  }
}

export async function updateStaffById(
  id: string,
  body: IStaff,
  enqueueSnackbar?: (message: string, options?: object) => void
) {
  try {
    const url = endpoints.staff.update(id);
    const res = await axiosInstance.put(url, body);
    return res.data;
  } catch (error) {
    enqueueSnackbar?.(error.error, { variant: 'error' });
    return console.error(error);
  }
}

export async function deleteStaffById(id: string) {
  try {
    const url = endpoints.staff.delete(id);
    const res = await axiosInstance.delete(url);
    return res.data;
  } catch (error) {
    console.error(error);
    return error.status;
  }
}
