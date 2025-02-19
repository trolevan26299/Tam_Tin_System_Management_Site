import { palette as themePalette } from 'src/theme/palette';

// ----------------------------------------------------------------------

const palette = themePalette('light');

export const CALENDAR_COLOR_OPTIONS = [
  palette.primary.main,
  palette.secondary.main,
  palette.info.main,
  palette.info.darker,
  palette.success.main,
  palette.warning.main,
  palette.error.main,
  palette.error.darker,
];

export const PERIOD_OPTIONS = [
  {
    value: '0-days',
    label: 'Hôm nay',
  },
  {
    value: '1-days',
    label: 'Hôm qua',
  },
  {
    value: '0-weeks',
    label: 'Tuần này',
  },
  {
    value: '0-months',
    label: 'Tháng này',
  },
  {
    value: '0-years',
    label: 'Năm này',
  },
  {
    value: '1-weeks',
    label: 'Tuần trước',
  },
  {
    value: '1-months',
    label: 'Tháng trước',
  },
  {
    value: '1-years',
    label: 'Năm trước',
  },
  {
    value: '_all_',
    label: 'Nhập trực tiếp',
  },
];
