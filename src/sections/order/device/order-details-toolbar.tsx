// @mui
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// routes
import { RouterLink } from 'src/routes/components';
// utils
import { fDateTime } from 'src/utils/format-time';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  backLink: string;
  orderNumber: string;
  createdAt: Date;
  onEdit?: VoidFunction;
};

export default function OrderDetailsToolbar({
  backLink,
  createdAt,
  orderNumber,
  onEdit,
}: Props) {


  return (
    <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <Stack spacing={1} direction="row" alignItems="flex-start">
          <IconButton component={RouterLink} href={backLink}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>

          <Stack spacing={0.5}>
            <Stack spacing={1} direction="row" alignItems="center">
              <Typography variant="h4"> Order {orderNumber} </Typography>
            </Stack>

            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              {fDateTime(createdAt, 'dd/MM/yyyy HH:mm')}
            </Typography>
          </Stack>
        </Stack>

        <Stack
          flexGrow={1}
          spacing={1.5}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Button
            color="inherit"
            variant="contained"
            startIcon={<Iconify icon="solar:pen-bold" />}
            onClick={() => onEdit?.()}
          >
            Chỉnh sửa
          </Button>
        </Stack>
      </Stack>
  );
}
