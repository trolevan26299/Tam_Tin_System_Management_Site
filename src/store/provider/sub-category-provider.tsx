'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { getListSubCategory } from 'src/api/allCategory';
import { ISubCategory } from 'src/types/category';
import { SubCategoryContext } from '../context/sub-category-context';

interface SubCategoryProviderProps {
  children: ReactNode;
}

export function SubCategoryProvider({ children }: SubCategoryProviderProps) {
  const [subCategoryList, setSubCategoryList] = useState<ISubCategory[]>([]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const subCategoryListRes = await getListSubCategory();
        setSubCategoryList(subCategoryListRes.data);
      } catch (error) {
        console.error('Failed to fetch sub category list:', error);
      }
    };

    fetchSubCategories();
  }, []);

  const contextValue = useMemo(
    () => ({
      subCategoryList,
    }),
    [subCategoryList]
  );

  return <SubCategoryContext.Provider value={contextValue}>{children}</SubCategoryContext.Provider>;
}
