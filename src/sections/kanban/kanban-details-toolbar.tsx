import { useState, useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useGetBoard } from 'src/api/kanban';

// ----------------------------------------------------------------------

type Props = {
  taskName: string;
  taskStatus: string;
  onDelete: VoidFunction;
  onCloseDetails: VoidFunction;
};

export default function KanbanDetailsToolbar({
  taskName,
  onDelete,
  taskStatus,
  onCloseDetails,
}: Props) {
  const { board } = useGetBoard();
  const smUp = useResponsive('up', 'sm');

  const confirm = useBoolean();

  const popover = usePopover();

  const [status, setStatus] = useState(taskStatus);

  const handleChangeStatus = useCallback(
    (newValue: string) => {
      popover.onClose();
      setStatus(newValue);
    },
    [popover]
  );

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          p: (theme) => theme.spacing(2.5, 1, 2.5, 2.5),
        }}
      >
        {!smUp && (
          <Tooltip title="Back">
            <IconButton onClick={onCloseDetails} sx={{ mr: 1 }}>
              <Iconify icon="eva:arrow-ios-back-fill" />
            </IconButton>
          </Tooltip>
        )}

        <Button
          size="small"
          variant="soft"
          endIcon={<Iconify icon="eva:arrow-ios-downward-fill" width={16} sx={{ ml: -0.5 }} />}
          onClick={popover.onOpen}
        >
          {status}
        </Button>

        <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
          <Tooltip title="Xóa công việc">
            <IconButton onClick={confirm.onTrue}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        sx={{ width: 140 }}
      >
        {board.columns.map((option: any) => (
          <MenuItem
            key={option.id}
            selected={status === option.name}
            onClick={() => {
              handleChangeStatus(option.name);
            }}
          >
            {option.name}
          </MenuItem>
        ))}
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Xóa công việc"
        content={
          <>
            Bạn có muốn xóa công việc <strong> {taskName} </strong>?
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={onDelete}>
            Xóa
          </Button>
        }
      />
    </>
  );
}
