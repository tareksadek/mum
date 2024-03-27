import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Grow, CircularProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { RootState } from '../store/reducers';
import { useSaveButtonStyles } from './appStyles';

interface SaveButtonProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled: boolean | undefined;
  processing?: boolean;
  text: string;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onClick, type, disabled, processing, text }) => {
  const classes = useSaveButtonStyles()
  const notification = useSelector((state: RootState) => state.notificationCenter.notification);
  const isOpen = useSelector((state: RootState) => state.notificationCenter.isOpen);

  return (
    <>
      <Button
        onClick={onClick}
        type={type || undefined}
        fullWidth
        variant="contained"
        color="primary"
        disabled={disabled}
        sx={{
          ...classes.saveButton,
          ...(isOpen && notification && notification.type === 'success' && classes.saveButtonSuccess),
          ...(isOpen && notification && notification.type === 'error' && classes.saveButtonError),
        }}
      >
        {isOpen && notification && notification.type === 'success' && (
          <Grow in={true}>
            <CheckCircleOutlineIcon />
          </Grow>
        )}
        {isOpen && notification && notification.type === 'error' && (
          <Grow in={true}>
            <HighlightOffIcon />
          </Grow>
        )}
        {processing && (
          <CircularProgress size={20} color="primary" sx={classes.buttonProgress} />
        )}
        {!notification && text}
      </Button>
    </>
  );
};

export default SaveButton;