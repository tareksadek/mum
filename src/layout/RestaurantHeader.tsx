import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Slide,
} from "@mui/material";
import ShareIcon from '@mui/icons-material/Share';
import EditNoteIcon from '@mui/icons-material/EditNote';
import PreviewIcon from '@mui/icons-material/Preview';
import { MenuIcon, Logo } from './CustomIcons';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useAppHeaderStyles } from './appStyles';
import { AppDispatch, RootState } from '../store/reducers';
import { openModal, closeModal } from '../store/reducers/modal';
import { toggleMode } from '../store/reducers/appMode';
import QrDrawer from '../components/Restaurant/View/QrDrawer';

type AppHeaderProps = {
  isLoggedIn: boolean;
  onMenuButtonClick: () => void;
};

type HideOnScrollProps = {
  children: React.ReactElement;
};

const HideOnScroll: React.FC<HideOnScrollProps> = (props) => {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {props.children}
    </Slide>
  );
}

const RestaurantHeader: React.FC<AppHeaderProps> = ({
  isLoggedIn,
  onMenuButtonClick,
}) => {
  const classes = useAppHeaderStyles()
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const openModalName = useSelector((state: RootState) => state.modal.openModal);
  const isQrModalOpen = openModalName === 'qr';

  const appMode = useSelector((state: RootState) => state.mode.mode);

  const goToLogin = () => {
    if (!isLoggedIn) {
      router.push('/login')
    }
  }

  const handleQrClick = () => {
    dispatch(openModal('qr'));
  };

  const handleOfflineChipClick = () => {
    alert("You're offline right now. No worries! You can still use the app, but be aware that some data might not be up-to-date and a few features require an online connection. We'll sync everything once you're back online!")
  }  

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="fixed"
          classes={{
            root: `${classes.appBarRoot} ${classes.profileAppBar}`
          }}
          sx={{
            ...classes.appBarRoot,
            ...(true && classes.profileAppBar),
          }}
        >
          <Toolbar>
            <Box display="flex" alignItems="center" gap={3.5}>
              <IconButton
                edge="end"
                aria-label="qr-code"
                onClick={goToLogin}
                sx={classes.appBarButtons}
              >
                <Logo />
              </IconButton>
              {isLoggedIn && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={appMode === 'view' ? <EditNoteIcon /> : <PreviewIcon />}
                  onClick={() => dispatch(toggleMode())}
                  sx={classes.modeButton}
                >
                  {appMode === 'view' ? 'Edit' : 'View'}
                </Button>
              )}
            </Box>

            <IconButton
              edge="end"
              aria-label="qr-code"
              style={{
                marginLeft: 'auto',
                marginRight: 0,
                visibility: 'visible',
              }}
              onClick={handleQrClick}
              sx={classes.appBarButtons}
            >
              <ShareIcon />
            </IconButton>

            {isLoggedIn && (
              <IconButton
                edge="start"
                aria-label="menu"
                onClick={onMenuButtonClick}
                sx={classes.appBarButtons}
                style={{
                  marginLeft: 16,
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      {isQrModalOpen && (
        <QrDrawer
          open={isQrModalOpen}
          onClose={() => dispatch(closeModal())}
        />
      )}
      
    </>
  );
}

export default RestaurantHeader;