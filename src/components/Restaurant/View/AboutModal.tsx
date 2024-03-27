import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TransitionProps } from '@mui/material/transitions';
import { Box, Slide, IconButton, Typography, Dialog } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useLayoutStyles } from '../../../theme/layout';
import { RootState, AppDispatch } from '../../../store/reducers';
import { authSelector } from '../../../store/selectors/auth';
import { restaurantSelector } from '../../../store/selectors/restaurant';
import { menuSelector } from '../../../store/selectors/menu';
import { closeModal } from '../../../store/reducers/modal';
import AppContentContainer from '../../../layout/AppContentContainer';
import { MenuItemType, MenuSectionType } from '../../../types/menu';
import About from './About';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface MenuItemDialogProps {
  item: MenuItemType | null;
  section: MenuSectionType | null;
  setIsEditingItem: React.Dispatch<React.SetStateAction<boolean>>;
}

const AboutModal: React.FC<MenuItemDialogProps> = ({ section, item }) => {
  const dispatch = useDispatch<AppDispatch>();
  const layoutClasses = useLayoutStyles()

  const openModalName = useSelector((state: RootState) => state.modal.openModal);
  const isAboutDialogOpen = openModalName === 'aboutDialog' ;

  const { userId } = useSelector(authSelector);
  const { restaurant } = useSelector(restaurantSelector);
  const { menu, menuId } = useSelector(menuSelector);

  const closeDialog = useCallback(() => {
    dispatch(closeModal())
  }, [dispatch]) 

  return (
    <Dialog
      fullScreen
      open={isAboutDialogOpen}
      TransitionComponent={Transition}
      onClose={closeDialog}
    >
      <AppContentContainer>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4" align="center">{item && item.id ? `Edit ${item.name}` : `Add Item to: ${section ? section.name : ''}`}</Typography>
          </Box>
          {restaurant && (
            <About restaurant={restaurant} />
          )}
        </Box>
      </AppContentContainer>
      <IconButton
        aria-label="delete"
        color="primary"
        sx={layoutClasses.drawerCloseButtonRight}
        disabled={false}
        onClick={closeDialog}
      >
        <ArrowBackIosIcon />
      </IconButton>
    </Dialog>
  );
}

export default AboutModal;
