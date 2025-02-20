import { Box, Button, Popover, Stack } from "@mui/material";
import { useState } from "react";
import { IHistoryRepair } from "src/types/product";
import { formatDate } from "src/utils/format-time";

export const RepairHistoryPopover = ({ history }: { history: IHistoryRepair }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={handleClick}
        sx={{
          minWidth: 120,
          justifyContent: 'flex-start',
          mr: 1,
          mb: 1
        }}
      >
        {formatDate(history.date_repair || '')} - {history.type_repair || ''}
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: { width: 320, p: 2 }
        }}
      >
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1}>
            <Box sx={{ typography: 'subtitle2' }}>Ngày:</Box>
            <Box sx={{ typography: 'body2' }}>{formatDate(history.date_repair || '')}</Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Box sx={{ typography: 'subtitle2' }}>Loại:</Box>
            <Box sx={{ typography: 'body2' }}>{history.type_repair}</Box>
          </Stack>

          {history.staff_repair && (
            <Stack direction="row" spacing={1}>
              <Box sx={{ typography: 'subtitle2' }}>Nhân viên:</Box>
              <Box sx={{ typography: 'body2' }}>{history.staff_repair}</Box>
            </Stack>
          )}

          {history.linh_kien && history.linh_kien.length > 0 && (
            <Box>
              <Box sx={{ typography: 'subtitle2', mb: 0.5 }}>Linh kiện:</Box>
              <Stack spacing={0.5}>
                {history.linh_kien.map((part, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      typography: 'body2',
                      ml: 1,
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{part.name}</span>
                    <span>SL: {part.total}</span>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {history.note && (
            <Stack direction="row" spacing={1}>
              <Box sx={{ typography: 'subtitle2' }}>Ghi chú:</Box>
              <Box sx={{ typography: 'body2' }}>{history.note}</Box>
            </Stack>
          )}
        </Stack>
      </Popover>
    </>
  );
};
