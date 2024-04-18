import { useTheme } from '@mui/material/styles';

export const useLayoutStyles = () => {
  const theme = useTheme();

  const drawerCloseButton = {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(2),
  };

  const drawerCloseButtonRight = {
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(2),
  }

  const radiusBottomDrawer = {
    position: 'relative',
    '& > .MuiPaper-root': {
      borderTopLeftRadius: theme.spacing(4),
      borderTopRightRadius: theme.spacing(4),
    }
  };

  const stickyBottomBox = {
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    zIndex: 2,
    opacity: 0,
    animation: 'fadeIn 0.5s forwards',
    '& button': {
      flex: 1,
    },
    paddingTop: theme.spacing(2),
    // [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      bottom: 0,
      width: '100%',
      left: 0,
      padding: theme.spacing(2),
    // },
  };

  const stickyModalCloseButton = {
    gap: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    zIndex: 2,
    opacity: 0,
    animation: 'fadeIn 0.5s forwards',
    position: 'fixed',
    top: theme.spacing(1),
    left: theme.spacing(1),
    borderRadius: theme.spacing(10),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& button': {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      top: 0,
      left: 4,
      '& svg': {
        color: theme.palette.background.reverse,
      },
    },
  };

  const panel = {
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.panel,
  };

  const editContainer = {
    borderRadius: theme.spacing(1),
    border: `1px dashed ${theme.palette.background.editContainer}`,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    position: 'relative',
    '&::after': {
      content: '""',
      width: '100%',
      height: '100%',
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 1,
      background: 'transparent',
    },
    '&:hover': {
      cursor: 'pointer'
    }
  }

  const editContainerIcon = {
    width: 55,
    color: theme.palette.background.editContainer,
    backgroundColor: theme.palette.background.panel,
    position: 'absolute',
    top: -12,
    left: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    '& svg': {
      fontSize: 16,
      marginRight: theme.spacing(0.5),
    }
  }

  const editContainerIconDefault = {
    backgroundColor: theme.palette.background.default,
  }

  const editButton = {
    '&.MuiButton-contained': {
      border: `1px dashed ${theme.palette.background.editContainer}`,
      color: theme.palette.background.editContainer,
      background: 'transparent',
      boxShadow: '0 0 0 transparent',
      textTransform: 'initial',
      '&:hover': {
        background: 'transparent',
        boxShadow: '0 0 0 transparent',
      }
    }
  }

  const editLogoSection = {
    width: 95,
    height: 95,
    position: 'absolute',
    top: 5,
    left: 5,
    border: `1px dashed ${theme.palette.background.editContainer}`,
    borderRadius: 100,
    cursor: 'pointer',
    '&::after': {
      content: '""',
      width: '100%',
      height: '100%',
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 1,
      background: 'transparent',
      borderRadius: 100,
    },
  }

  const editLogoSectionIcon = {
    width: 30,
    height: 30,
    position: 'absolute',
    left: 0,
    right: 0,
    margin: 'auto',
    bottom: -15,
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    '& svg': {
      color: theme.palette.background.editContainer,
      fontSize: 18,
    }
  }

  return {
    drawerCloseButton,
    drawerCloseButtonRight,
    radiusBottomDrawer,
    stickyBottomBox,
    panel,
    stickyModalCloseButton,
    editContainer,
    editContainerIcon,
    editContainerIconDefault,
    editButton,
    editLogoSection,
    editLogoSectionIcon,
  };
};

