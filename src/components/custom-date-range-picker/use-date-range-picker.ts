import { useState, useCallback } from 'react';
// utils
import { fDate } from 'src/utils/format-time';
//
import { shortDateLabel } from './utils';
import { DateRangePickerProps } from './types';

// ----------------------------------------------------------------------

type ReturnType = DateRangePickerProps;

export default function useDateRangePicker(start: Date | null, end: Date | null): ReturnType {
  const [open, setOpen] = useState(false);

  const [endDate, setEndDate] = useState(end ? new Date(end) : null);

  const [startDate, setStartDate] = useState(start ? new Date(start) : null);

  const error = startDate && endDate ? startDate.getTime() > endDate.getTime() : false;

  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  const onChangeStartDate = useCallback((newValue: Date | null) => {
    setStartDate(newValue);
  }, []);

  const onChangeEndDate = useCallback(
    (newValue: Date | null) => {
      if (error) {
        setEndDate(null);
      }
      setEndDate(newValue);
    },
    [error]
  );

  const onReset = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
  }, []);

  return {
    startDate,
    endDate,
    onChangeStartDate,
    onChangeEndDate,
    //
    open,
    onOpen,
    onClose,
    onReset,
    //
    selected: !!startDate && !!endDate,
    error,
    //
    label: `${fDate(startDate)} - ${fDate(endDate)}`,
    shortLabel: shortDateLabel(startDate, endDate),
    //
    setStartDate,
    setEndDate,
  };
}
