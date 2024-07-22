import { IconButton, InputAdornment, TextField } from '@mui/material';
import { debounce } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import Iconify from '../iconify';

interface SearchProps {
  onSearch: (query: string) => void;
  delay?: number;
  placeholder?: string;
  width?: number;
  fullWidth?: boolean;
  value: string;
  useIconClear?: boolean;
}

export default function SearchInputDebounce({
  onSearch,
  delay = 2000,
  placeholder,
  width,
  fullWidth,
  value,
  useIconClear,
}: SearchProps) {
  const [query, setQuery] = useState<string>('');

  const debouncedSearch = useMemo(() => debounce(onSearch, delay), [onSearch, delay]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    setQuery(value);
  }, [value]);
  return (
    <TextField
      fullWidth={fullWidth}
      sx={{ width }}
      value={query}
      onChange={handleChange}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
        endAdornment: useIconClear && (
          <InputAdornment position="end">
            <IconButton
              onClick={() => {
                setQuery('');
                onSearch('');
              }}
            >
              <Iconify icon="eva:close-fill" sx={{ color: 'text.disabled' }} />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
