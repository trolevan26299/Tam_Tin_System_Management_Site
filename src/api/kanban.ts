import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
// utils
import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';
// types
import { IKanbanColumn, IKanbanTask, IKanban } from 'src/types/kanban';

// ----------------------------------------------------------------------

const URL = endpoints.kanban;

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetBoard() {
  const { data, error, isValidating } = useSWR(URL, fetcher, options);

  const memoizedValue = useMemo(
    () => ({
      board: data?.board as IKanban,
      boardLoading: !data && !error,
      boardError: error,
      boardValidating: isValidating,
      boardEmpty: !data?.board?.ordered?.length,
    }),
    [data, error, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createColumn(columnData: IKanbanColumn) {
  try {
    await axiosInstance.post(`${URL}/column`, columnData);
    mutate(URL);
  } catch (error) {
    console.error('Failed to create column:', error);
  }
}

// ----------------------------------------------------------------------

export async function updateColumn(columnId: string, columnName: string) {
  try {
    await axiosInstance.put(`${URL}/column/${columnId}`, { name: columnName });
    mutate(URL);
  } catch (error) {
    console.error('Failed to update column:', error);
  }
}

// ----------------------------------------------------------------------
export async function moveColumn(newOrdered: string[]) {
  try {
    // Gửi yêu cầu POST để cập nhật thứ tự các cột
    await axiosInstance.post(`${URL}/column/order`, { newOrdered });

    // Cập nhật lại dữ liệu cục bộ từ server
    mutate(URL);
  } catch (error) {
    console.error('Failed to move column:', error);
  }
}

// ----------------------------------------------------------------------
export async function clearColumn(columnId: string) {
  try {
    await axiosInstance.post(`${URL}/column/clear`, { columnId });
    mutate(URL);
  } catch (error) {
    console.error('Failed to clear column:', error);
  }
}

// ----------------------------------------------------------------------

export async function deleteColumn(columnId: string) {
  try {
    await axiosInstance.delete(`${URL}/column/${columnId}`);
    mutate(URL);
  } catch (error) {
    console.error('Failed to delete column:', error);
  }
}

// ----------------------------------------------------------------------

export async function createTask(columnId: string, taskData: IKanbanTask) {
  try {
    await axiosInstance.post(`${URL}/task`, { ...taskData, columnId });
    mutate(URL);
  } catch (error) {
    console.error('Failed to create task:', error);
  }
}

// ----------------------------------------------------------------------
export async function updateTask(taskData: IKanbanTask) {
  try {
    await axiosInstance.put(`${URL}/task/${taskData.id}`, taskData);
    mutate(URL);
  } catch (error) {
    console.error('Failed to update task:', error);
  }
}

// ----------------------------------------------------------------------

export async function moveTask(updateColumns: Record<string, IKanbanColumn>) {
  try {
    await axiosInstance.post(`${URL}/task/move`, { updateColumns });
    mutate(URL);
  } catch (error) {
    console.error('Failed to move task:', error);
  }
}

// ----------------------------------------------------------------------

export async function deleteTask(columnId: string, taskId: string) {
  try {
    await axiosInstance.delete(`${URL}/task/${columnId}/${taskId}`);
    mutate(URL);
  } catch (error) {
    console.error('Failed to delete task:', error);
  }
}
