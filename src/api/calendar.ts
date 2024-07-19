import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
// utils
import axiosInstance, { endpoints, fetcher } from 'src/utils/axios';
// types
import { ICalendarEvent } from 'src/types/calendar';

// ----------------------------------------------------------------------

const URL = endpoints.calendar;

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetEvents() {
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  const memoizedValue = useMemo(() => {
    const events = data?.map((event: ICalendarEvent) => ({
      ...event,
      textColor: event.color,
    }));

    return {
      events: (events as ICalendarEvent[]) || [],
      eventsLoading: isLoading,
      eventsError: error,
      eventsValidating: isValidating,
      eventsEmpty: !isLoading && !data?.length,
    };
  }, [data, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createEvent(eventData: ICalendarEvent) {
  await axiosInstance.post(URL, eventData);
  mutate(URL);
}

// ----------------------------------------------------------------------

export async function updateEvent(eventData: Partial<ICalendarEvent>) {
  if (!eventData.id) {
    throw new Error('Event ID is required for updating.');
  }
  const updateUrl = `${endpoints.calendar}/${eventData.id}`;
  await axiosInstance.put(updateUrl, eventData);
  mutate(URL);
}

// ----------------------------------------------------------------------

export async function deleteEvent(eventId: string) {
  const deleteUrl = `${endpoints.calendar}/${eventId}`;
  await axiosInstance.delete(deleteUrl);
  mutate(URL);
}
