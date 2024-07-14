import { useRef, useState, useEffect, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
//
import KanbanInputName from './kanban-input-name';

// ----------------------------------------------------------------------

type Props = {
  columnName: string;
  onDeleteColumn: VoidFunction;
  onClearColumn: VoidFunction;
  onUpdateColumn: (inputName: string) => void;
};

export default function KanbanColumnToolBar({
  columnName,
  onDeleteColumn,
  onClearColumn,
  onUpdateColumn,
}: Props) {
  const renameRef = useRef<HTMLInputElement>(null);

  const popover = usePopover();

  const confirmDialogDelete = useBoolean();
  const confirmDialogClear = useBoolean();

  const [name, setName] = useState(columnName);

  useEffect(() => {
    if (popover.open) {
      if (renameRef.current) {
        renameRef.current.focus();
      }
    }
  }, [popover.open]);

  const handleChangeName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }, []);

  const handleKeyUpUpdateColumn = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        if (renameRef.current) {
          renameRef.current.blur();
        }
        onUpdateColumn(name);
      }
    },
    [name, onUpdateColumn]
  );

  return (
    <>
      <Stack
        spacing={1}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pt: 3 }}
      >
        <KanbanInputName
          inputRef={renameRef}
          placeholder="Section name"
          value={name}
          onChange={handleChangeName}
          onKeyUp={handleKeyUpUpdateColumn}
        />

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-horizontal-fill" />
        </IconButton>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{
          ml: 1.5,
          width: 160,
        }}
      >
        <MenuItem onClick={popover.onClose}>
          <Iconify icon="solar:pen-bold" />
          Đổi tên cột
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirmDialogClear.onTrue();
            onClearColumn();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eraser-bold" />
          Clear nhiệm vụ
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirmDialogDelete.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Xóa
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirmDialogDelete.value}
        onClose={confirmDialogDelete.onFalse}
        title="Delete"
        content={
          <>
            Bạn có muốn xóa cột này ?
            <Box sx={{ typography: 'caption', color: 'error.main', mt: 2 }}>
              <strong> Lưu ý: </strong>Tất cả nội dung và nhiệm vụ trong cột này sẽ bị xóa.
            </Box>
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteColumn();
              confirmDialogDelete.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
