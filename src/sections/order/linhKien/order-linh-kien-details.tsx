import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { IOrderLinhKien } from 'src/types/order-linh-kien';
import { renderMoney } from 'src/utils/format-number';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';

type Props = {
  order: IOrderLinhKien;
};

export default function OrderLinhKienDetails({ order }: Props) {
  const router = useRouter();

  const renderLinhKienInfo = (
    <Card>
      <CardHeader title="Thông tin linh kiện" />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Tên linh kiện
          </Typography>
          <Typography variant="subtitle2">{order.chi_tiet_linh_kien.map(item => item.id_linh_kien.name_linh_kien)}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Số lượng
          </Typography>
          <Typography variant="subtitle2">{order.chi_tiet_linh_kien.map(item => item.so_luong)}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Tổng tiền
          </Typography>
          <Typography variant="subtitle2">{renderMoney(String(order.tong_tien))} VNĐ</Typography>
        </Stack>
      </Stack>
    </Card>
  );

  const renderCustomerInfo = (
    <Card>
      <CardHeader title="Thông tin khách hàng" />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Tên khách hàng
          </Typography>
          <Typography variant="subtitle2">{order.id_khach_hang.name}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Địa chỉ
          </Typography>
          <Typography variant="subtitle2">{order.id_khach_hang.address}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Số điện thoại
          </Typography>
          <Typography variant="subtitle2">{order.id_khach_hang.phone}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Email
          </Typography>
          <Typography variant="subtitle2">{order.id_khach_hang.email}</Typography>
        </Stack>
      </Stack>
    </Card>
  );

  const renderOrderInfo = (
    <Card>
      <CardHeader title="Thông tin đơn hàng" />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Mã đơn hàng
          </Typography>
          <Typography variant="subtitle2">{order._id}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Ngày tạo
          </Typography>
          <Typography variant="subtitle2">
            {format(new Date(order.ngay_tao), 'dd/MM/yyyy HH:mm')}
          </Typography>
        </Stack>

        {order.ngay_cap_nhat && (
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Ngày cập nhật
            </Typography>
            <Typography variant="subtitle2">
              {format(new Date(order.ngay_cap_nhat), 'dd/MM/yyyy HH:mm')}
            </Typography>
          </Stack>
        )}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle1">Tổng tiền</Typography>
          <Typography variant="subtitle1">{renderMoney(String(order.tong_tien))} VNĐ</Typography>
        </Stack>
      </Stack>
    </Card>
  );

  const renderNote = order.ghi_chu && (
    <Card>
      <CardHeader title="Ghi chú" />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="body2">{order.ghi_chu}</Typography>
      </Stack>
    </Card>
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          {renderLinhKienInfo}
          {renderCustomerInfo}
          {renderNote}
        </Stack>
      </Grid>

      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          {renderOrderInfo}

          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              color="inherit"
              variant="outlined"
              size="large"
              onClick={() => router.push('')}
              startIcon={<Iconify icon="solar:pen-bold" />}
            >
              Chỉnh sửa
            </Button>

            <Button
              fullWidth
              color="inherit"
              variant="outlined"
              size="large"
              onClick={() => router.push('')}
              startIcon={<Iconify icon="eva:arrow-back-fill" />}
            >
              Quay lại
            </Button>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}
