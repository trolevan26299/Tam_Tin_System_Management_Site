// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
// utils
import { renderMoney } from 'src/utils/format-number';
// types
import { Items } from 'src/types/order';
// components
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type Props = {
  totalAmount: number;
  items: Items[];
  discount: number;
};

export default function OrderDetailsItems({
  items,
  totalAmount,
  discount,
}: Props) {
  const renderTotal = (
    <Stack
      spacing={2}
      alignItems="flex-end"
      sx={{ my: 3, textAlign: 'right', typography: 'body2' }}
    >
      <Stack direction="row" sx={{ typography: 'subtitle1' }}>
        <Box>Giảm giá :</Box>
        <Box sx={{ width: 160 }}>{renderMoney(String(discount)) || '-'}</Box>
      </Stack>
      <Stack direction="row" sx={{ typography: 'subtitle1' }}>
        <Box>Tổng tiền :</Box>
        <Box sx={{ width: 160 }}>{renderMoney(String(totalAmount)) || '-'}</Box>
      </Stack>
    </Stack>
  );

  return (
    <Card>
      <CardHeader title="Thông tin sản phẩm" />

      <Stack
        sx={{
          px: 3,
        }}
      >
        <Scrollbar>
          {items?.map((item) => (
            <Stack
              key={item.device?._id}
              direction="row"
              alignItems="center"
              sx={{
                py: 3,
                minWidth: 640,
                borderBottom: (theme) => `dashed 2px ${theme.palette.background.neutral}`,
              }}
            >
              <ListItemText
                primary={item.device?.name}
                secondary={item.device?.sku}
                primaryTypographyProps={{
                  typography: 'body2',
                }}
                secondaryTypographyProps={{
                  component: 'span',
                  color: 'text.disabled',
                  mt: 0.5,
                }}
              />

              <Box sx={{ typography: 'body2' }}>x{item.details?.length}</Box>

              <Box sx={{ width: 110, textAlign: 'right', typography: 'subtitle2' }}>
                {renderMoney(String(Number(item.price) * Number(item.details?.length)))}
              </Box>
            </Stack>
          ))}
        </Scrollbar>

        {renderTotal}
      </Stack>
    </Card>
  );
}
