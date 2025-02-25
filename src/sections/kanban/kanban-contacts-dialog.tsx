/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useCallback } from 'react';
// @mui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
// _mock
import { _contacts } from 'src/_mock';
// types
import { IKanbanAssignee } from 'src/types/kanban';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import SearchNotFound from 'src/components/search-not-found';
import { IStaff } from 'src/types/staff';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 64;

type Props = {
  staffs?: IStaff[];
  open: boolean;
  onClose: VoidFunction;
  assignee: IKanbanAssignee[];
  handleChangeSetAssignee?: (assignee: any[]) => void;
};

export default function KanbanContactsDialog({
  staffs,
  assignee,
  open,
  onClose,
  handleChangeSetAssignee,
}: Props) {
  const notFound = !staffs;

  const toggleAssignee = useCallback(
    (contact: any) => {
      const isAssigned = assignee?.some((person) => person.username_telegram === contact.username_telegram);
      let updatedAssignees;
      if (isAssigned) {
        updatedAssignees = assignee?.filter((person) => person.username_telegram !== contact.username_telegram);
      } else {
        updatedAssignees = [...assignee, contact];
      }
      handleChangeSetAssignee && handleChangeSetAssignee(updatedAssignees);
    },
    [assignee, handleChangeSetAssignee]
  );

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 0 }}>
        Nhân viên <Typography component="span">({staffs?.length})</Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {notFound ? (
          <SearchNotFound sx={{ mt: 3, mb: 10 }} />
        ) : (
          <Scrollbar
            sx={{
              px: 2.5,
              height: ITEM_HEIGHT * 6,
            }}
          >
            {staffs?.map((contact) => {
              const checked = assignee.map((person) => person.username_telegram).includes(contact?.username_telegram || '');

              return (
                <ListItem
                  key={contact._id}
                  disableGutters
                  secondaryAction={
                    <Button
                      size="small"
                      color={checked ? 'error' : 'inherit'}
                      startIcon={
                        <Iconify
                          width={16}
                          icon={checked ? 'eva:checkmark-fill' : 'mingcute:add-line'}
                          sx={{ mr: -0.5 }}
                        />
                      }
                      onClick={() => toggleAssignee(contact)}
                    >
                      {checked ? 'Hủy' : 'Thêm'}
                    </Button>
                  }
                  sx={{ height: ITEM_HEIGHT }}
                >
                  <ListItemAvatar>
                    <Avatar src="" alt="image Avatar" />
                  </ListItemAvatar>

                  <ListItemText
                    primaryTypographyProps={{
                      typography: 'subtitle2',
                      sx: { mb: 0.25 },
                    }}
                    secondaryTypographyProps={{ typography: 'caption' }}
                    primary={contact.name}
                    secondary={contact.username_telegram}
                  />
                </ListItem>
              );
            })}
          </Scrollbar>
        )}
      </DialogContent>
    </Dialog>
  );
}
