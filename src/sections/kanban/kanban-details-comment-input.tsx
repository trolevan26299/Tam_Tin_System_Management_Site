/* eslint-disable react-hooks/exhaustive-deps */
// @mui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// components
import { useSnackbar } from 'notistack';
import { useCallback, useContext, useState } from 'react';
import { AuthContext } from 'src/auth/context/jwt';
import { IKanbanTask } from 'src/types/kanban';

// ----------------------------------------------------------------------
type Props = {
  task: IKanbanTask;
  onUpdateTask: (updateTask: IKanbanTask) => void;
};
export default function KanbanDetailsCommentInput({ task, onUpdateTask }: Props) {
  const { user } = useMockedUser();
  const { user: userComment } = useContext(AuthContext);
  const snackbar = useSnackbar();
  const [inputComment, setInputComment] = useState('');

  const handleChangeComment = (comment: string) => {
    setInputComment(comment);
  };
  const handleUpdateTask = useCallback(() => {
    try {
      const newComment = {
        id: (task.comments.length + 1).toString(),
        name: userComment && userComment?.username,
        message: inputComment,
        avatarUrl: userComment?.avatarUrl || '',
        messageType: 'text' as 'text',
        createdAt: new Date(),
      };
      const updateTask = {
        ...task,
        comments: [...task.comments, newComment],
      };
      onUpdateTask(updateTask);
      setInputComment('');
      snackbar.enqueueSnackbar('Cập nhật công việc thành công !', { variant: 'success' });
    } catch (error) {
      console.error(error);
      snackbar.enqueueSnackbar('Cập nhật công việc thất bại !', { variant: 'error' });
    }
  }, [onUpdateTask, task, inputComment]);
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        py: 3,
      }}
    >
      <Avatar src={user?.photoURL} alt={user?.displayName} />

      <Paper variant="outlined" sx={{ p: 1, flexGrow: 1, bgcolor: 'transparent' }}>
        <InputBase
          fullWidth
          multiline
          rows={2}
          placeholder="Nhập bình luận..."
          sx={{ px: 1 }}
          value={inputComment}
          onChange={(e) => handleChangeComment(e.target.value)}
        />

        <Stack direction="row" alignItems="center">
          <Button variant="contained" onClick={handleUpdateTask}>
            Bình luận
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
