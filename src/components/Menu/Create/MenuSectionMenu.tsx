import React from 'react';
import {
  Divider,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';

interface MenuSectionMenuProps {
  title: string | null;
  image: string | null;
  open: boolean;
  anchorEl: HTMLElement | null;
  handleClose?: () => void;
  sectionId: string;
  buttonOneText?: string | null;
  buttonOneAction?: (id: string) => void;
  buttonTwoText?: string | null;
  buttonTwoAction?: (id: string) => void;
  buttonThreeText?: string | null;
  buttonThreeAction?: (sectionId: string, sectionName: string, sectionImageUrl: string | null) => void;
}

const MenuSectionMenu: React.FC<MenuSectionMenuProps> = ({
  title,
  image,
  anchorEl,
  open,
  handleClose,
  sectionId,
  buttonOneAction,
  buttonOneText,
  buttonTwoAction,
  buttonTwoText,
  buttonThreeAction,
  buttonThreeText,
}) => {
  const onButtonOneClick = () => {
    if (sectionId && buttonOneAction && handleClose) {
      buttonOneAction(sectionId)
      handleClose()
    }
  }

  const onButtonTwoClick = () => {
    if (sectionId && buttonTwoAction && handleClose) {
      buttonTwoAction(sectionId)
      handleClose()
    }
  }

  const onButtonThreeClick = () => {
    if (sectionId && buttonThreeAction && handleClose) {
      buttonThreeAction(sectionId, title || 'this section', image)
      handleClose()
    }
  }

  return (
    <Menu
      id={`${sectionId}-menu`}
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': `${sectionId}-button`,
      }}
    >
      <MenuItem onClick={onButtonOneClick}>
        <ListItemIcon>
          <EditNoteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{buttonOneText}</ListItemText>
      </MenuItem>
      <MenuItem onClick={onButtonTwoClick}>
        <ListItemIcon>
          <AddCircleIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{buttonTwoText}</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={onButtonThreeClick}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{buttonThreeText}</ListItemText>
      </MenuItem>
    </Menu>
  );
}

export default MenuSectionMenu;