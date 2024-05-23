import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';
// types
import { ICategory, ISubCategory } from 'src/types/category';

// ------category----------------------------------------------------------------

export async function getListCategory() {
  try {
    const res = await axiosInstance.get(endpoints.category.list);
    return res.data.data;
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
export async function getListSubCategory() {
  try {
    const res = await axiosInstance.get(endpoints.subCategory.list);
    return res.data.data;
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

// export function useSearchPosts(query: string) {
//   const URL = query ? [endpoints.post.search, { params: { query } }] : null;

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
//     keepPreviousData: true,
//   });

//   const memoizedValue = useMemo(
//     () => ({
//       searchResults: (data?.results as IPostItem[]) || [],
//       searchLoading: isLoading,
//       searchError: error,
//       searchValidating: isValidating,
//       searchEmpty: !isLoading && !data?.results.length,
//     }),
//     [data?.results, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }
