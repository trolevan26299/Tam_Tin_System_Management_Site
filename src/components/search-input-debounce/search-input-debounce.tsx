import { InputAdornment, TextField } from '@mui/material';
import { debounce } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import Iconify from '../iconify';

interface SearchProps {
  onSearch: (query: string) => void;
  delay?: number;
  placeholder?: string;
  width?: number;
}

export default function SearchInputDebounce({
  onSearch,
  delay = 2000,
  placeholder,
  width,
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
  return (
    <TextField
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
      }}
    />
  );
}
