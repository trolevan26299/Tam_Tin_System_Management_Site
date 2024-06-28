'use client';

import { createContext, useContext } from 'react';
import { ISubCategory } from 'src/types/category';

interface SubCategoryContextType {
  subCategoryList: ISubCategory[];
}

export const SubCategoryContext = createContext<SubCategoryContextType>({
  subCategoryList: [],
});

export const useGetSubCategory = () => {
  const context = useContext(SubCategoryContext);
  if (!context) {
    throw new Error('useGetSubCategory must be used within an useGetSubCategoryProvider');
  }
  return context;
};
