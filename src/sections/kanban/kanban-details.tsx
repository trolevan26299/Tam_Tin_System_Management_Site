/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
// @mui
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { alpha, styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
// types
import { IKanbanTask } from 'src/types/kanban';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import CustomDateRangePicker, { useDateRangePicker } from 'src/components/custom-date-range-picker';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
//
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Typography } from '@mui/material';
import { getStaffs } from 'src/api/staff';
import { IStaff } from 'src/types/staff';
import KanbanContactsDialog from './kanban-contacts-dialog';
import KanbanDetailsCommentInput from './kanban-details-comment-input';
import KanbanDetailsCommentList from './kanban-details-comment-list';
import KanbanDetailsPriority from './kanban-details-priority';
import KanbanDetailsToolbar from './kanban-details-toolbar';
import KanbanInputName from './kanban-input-name';

// ----------------------------------------------------------------------

const StyledLabel = styled('span')(({ theme }) => ({
  ...theme.typography.caption,
  width: 100,
  flexShrink: 0,
  color: theme.palette.text.secondary,
  fontWeight: theme.typography.fontWeightSemiBold,
}));

// ----------------------------------------------------------------------

type Props = {
  task: IKanbanTask;
  openDetails: boolean;
  onCloseDetails: VoidFunction;
  onUpdateTask: (updateTask: IKanbanTask) => void;
  onDeleteTask: VoidFunction;
};

export default function KanbanDetails({
  task,
  openDetails,
  onCloseDetails,
  onUpdateTask,
  onDeleteTask,
}: Props) {
  const [tabValue, setTabValue] = React.useState('1');
  const [staffList, setStaffList] = useState<IStaff[] | undefined>(undefined);

  const [priority, setPriority] = useState(task?.priority);

  const [taskName, setTaskName] = useState(task?.name);
  const [userAssigneeList, setUserAssigneeList] = useState(task.assignee);
  console.log('userAssigneeList', userAssigneeList);

  const contacts = useBoolean();

  const [taskDescription, setTaskDescription] = useState(task?.description);

  const rangePicker = useDateRangePicker(task?.due[0], task?.due[1]);
  console.log('rangePicker', rangePicker);
  console.log('priority:', priority);
  console.log('taskDescription', taskDescription);

  const handleChangeTab = (event: any, newValue: string) => {
    setTabValue(newValue);
  };
  const handleChangeSetAssignee = (assignee: any) => {
    setUserAssigneeList(assignee);
  };
  const handleChangeTaskName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(event.target.value);
  }, []);

  const handleUpdateTask = useCallback(() => {
    try {
      if (taskName) {
        onUpdateTask({
          ...task,
          name: taskName,
          assignee: userAssigneeList,
          priority,
          // due: rangePicker,
          description: taskDescription,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, [onUpdateTask, task, taskName, userAssigneeList, priority, taskDescription]);

  const handleChangeTaskDescription = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskDescription(event.target.value);
  }, []);

  const handleChangePriority = useCallback((newValue: string) => {
    setPriority(newValue);
  }, []);

  const renderHead = (
    <KanbanDetailsToolbar
      taskName={task?.name}
      onDelete={onDeleteTask}
      taskStatus={task?.status}
      onCloseDetails={onCloseDetails}
    />
  );

  const renderName = (
    <KanbanInputName
      placeholder="Tên công việc"
      value={taskName}
      onChange={handleChangeTaskName}
      onKeyUp={handleUpdateTask}
    />
  );

  const renderReporter = (
    <Stack direction="row" alignItems="center">
      <StyledLabel>Người tạo</StyledLabel>
      <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{task.reporter.name}</Typography>
    </Stack>
  );

  const renderAssignee = (
    <Stack direction="row">
      <StyledLabel sx={{ height: 40, lineHeight: '40px' }}>Người thực hiện</StyledLabel>

      <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1}>
        {userAssigneeList.map((userAssignee: any, index: number) => (
          <React.Fragment key={index}>
            {index > 0 && ', '}
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{userAssignee.name}</Typography>
          </React.Fragment>
        ))}

        <Tooltip title="Thêm người thực hiện">
          <IconButton
            onClick={contacts.onTrue}
            sx={{
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
              border: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          >
            <Iconify icon="mingcute:add-line" />
          </IconButton>
        </Tooltip>

        <KanbanContactsDialog
          handleChangeSetAssignee={handleChangeSetAssignee}
          assignee={userAssigneeList || []}
          open={contacts.value}
          onClose={contacts.onFalse}
          staffs={staffList}
        />
      </Stack>
    </Stack>
  );

  const renderDueDate = (
    <Stack direction="row" alignItems="center">
      <StyledLabel> Thời gian </StyledLabel>

      {rangePicker.selected ? (
        <Button size="small" onClick={rangePicker.onOpen}>
          {rangePicker.shortLabel}
        </Button>
      ) : (
        <Tooltip title="Thêm ngày bắt đầu - kết thúc">
          <IconButton
            onClick={rangePicker.onOpen}
            sx={{
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
              border: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          >
            <Iconify icon="mingcute:add-line" />
          </IconButton>
        </Tooltip>
      )}

      <CustomDateRangePicker
        variant="calendar"
        title="Chọn thời gian"
        startDate={rangePicker.startDate}
        endDate={rangePicker.endDate}
        onChangeStartDate={rangePicker.onChangeStartDate}
        onChangeEndDate={rangePicker.onChangeEndDate}
        open={rangePicker.open}
        onClose={rangePicker.onClose}
        selected={rangePicker.selected}
        error={rangePicker.error}
      />
    </Stack>
  );

  const renderPriority = (
    <Stack direction="row" alignItems="center">
      <StyledLabel>Mức độ </StyledLabel>

      <KanbanDetailsPriority priority={priority} onChangePriority={handleChangePriority} />
    </Stack>
  );

  const renderDescription = (
    <Stack direction="row">
      <StyledLabel> Ghi chú </StyledLabel>

      <TextField
        fullWidth
        multiline
        size="small"
        value={taskDescription}
        onChange={handleChangeTaskDescription}
        InputProps={{
          sx: { typography: 'body2' },
        }}
      />
    </Stack>
  );

  const renderConfirmEdit = (
    <Box
      sx={{
        marginTop: '20%',
        display: 'flex',
        justifyContent: 'flex-start',
        borderTop: '1px dashed gray',
      }}
    >
      <Button
        sx={{ marginTop: '10px', width: '100%', marginX: 'auto' }}
        variant="contained"
        size="medium"
        onClick={handleUpdateTask}
      >
        Chỉnh sửa
      </Button>
    </Box>
  );

  const renderComments = <KanbanDetailsCommentList comments={task?.comments} />;

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const staffs = await getStaffs();
        if (!staffs) return;
        setStaffList(staffs.data);
      } catch (error) {
        console.log('Failed to fetch task:', error);
      }
    };
    fetchStaffs();
  }, []);
  return (
    <Drawer
      open={openDetails}
      onClose={onCloseDetails}
      anchor="right"
      slotProps={{
        backdrop: { invisible: true },
      }}
      PaperProps={{
        sx: {
          width: {
            xs: 1,
            sm: 480,
          },
        },
      }}
    >
      {renderHead}

      <Divider />

      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            aria-label="lab API tabs example"
            sx={{ width: '100%' }}
            onChange={handleChangeTab}
          >
            <Tab label="Tổng quan" value="1" sx={{ width: '45%' }} />
            <Tab label="Bình luận" value="2" sx={{ width: '45%' }} />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Scrollbar
            sx={{
              height: 1,
              '& .simplebar-content': {
                height: 1,
                display: 'flex',
                flexDirection: 'column',
              },
            }}
          >
            <Stack spacing={3}>
              {renderName}

              {renderReporter}

              {renderAssignee}

              {renderDueDate}

              {renderPriority}

              {renderDescription}

              {renderConfirmEdit}
            </Stack>
          </Scrollbar>
        </TabPanel>
        <TabPanel value="2">
          <Scrollbar
            sx={{
              height: 1,
              '& .simplebar-content': {
                height: 1,
                display: 'flex',
                flexDirection: 'column',
              },
            }}
          >
            {!!task?.comments.length && renderComments} <KanbanDetailsCommentInput />
          </Scrollbar>
        </TabPanel>
      </TabContext>
    </Drawer>
  );
}
