// utils
import axiosInstance, { endpoints } from 'src/utils/axios';
// types
import { ICategory, IQueryCategory, ISubCategory } from 'src/types/category';

// ------category----------------------------------------------------------------
export async function getListCategory(query?: IQueryCategory) {
  try {
    const res = await axiosInstance.get(endpoints.category.list, {
      params: query,
    });
    return res.data;
  } catch (error) {
    return console.error(error);
  }
}

export async function getCategoryById(id: string) {
  try {
    const url = endpoints.category.details(id);
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    return console.error(error);
  }
}

export async function createCategory(body: ICategory) {
  try {
    const res = await axiosInstance.post(endpoints.category.create, body);
    return res.data;
  } catch (error) {
    return console.error(error);
  }
}

export async function updateCategoryById(id: string, body: ICategory) {
  try {
    const url = endpoints.category.update(id);
    const res = await axiosInstance.put(url, body);
    return res.data;
  } catch (error) {
    console.error(error);
    return error.status;
  }
}

export async function deleteCategoryById(id: string) {
  try {
    const url = endpoints.category.delete(id);
    const res = await axiosInstance.delete(url);
    return res.data;
  } catch (error) {
    console.error(error);
    return error.status;
  }
}

// ----sub category----------------------------------------------------------------
export async function getListSubCategory(query?: IQueryCategory) {
  try {
    const res = await axiosInstance.get(endpoints.subCategory.list, {
      params: query,
    });
    return res.data;
  } catch (error) {
    return console.error(error);
  }
}

export async function getSubCategoryById(id: string) {
  try {
    const url = endpoints.subCategory.details(id);
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    return console.error(error);
  }
}

export async function createSubCategory(body: ISubCategory) {
  try {
    const res = await axiosInstance.post(endpoints.subCategory.create, body);
    return res.data;
  } catch (error) {
    return console.error(error);
  }
}

export async function updateSubCategoryById(id: string, body: ISubCategory) {
  try {
    const url = endpoints.subCategory.update(id);
    const res = await axiosInstance.put(url, body);
    return res.data;
  } catch (error) {
    console.error(error);
    return error.status;
  }
}

export async function deleteSubCategoryById(id: string) {
  try {
    const url = endpoints.subCategory.delete(id);
    const res = await axiosInstance.delete(url);
    return res.data;
  } catch (error) {
    console.error(error);
    return error.status;
  }
}
