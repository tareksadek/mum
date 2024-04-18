import { useTheme } from '@mui/material/styles';

export const useAppStyles = () => {
  const theme = useTheme();

  const contentContainer = {
    maxWidth: '550px !important',
    padding: '0 !important',
  };

  const mainBox = {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
    paddingBottom: theme.spacing(10),
    [theme.breakpoints.down('sm')]: {
      paddingBottom: theme.spacing(10),
    },
  };

  const link = {
    color: theme.palette.background.link,
    textAlign: 'center',
    display: 'block',
    fontSize: '0.8rem',
    padding: theme.spacing(2)
  }

  const landingPageContainer = {}

  const landingPageLogoContainer = {
    '& svg': {
      color: theme.palette.background.reverse,
      fontSize: 60,
    }
  }

  const translateContainer = { 
    backgroundColor: '#fff',
    borderRadius: theme.spacing(1),
    '& .goog-te-gadget': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      '& .goog-te-gadget-simple': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        width: '100%',
      }
    }
  }

  return { mainBox, contentContainer, link, landingPageContainer, landingPageLogoContainer, translateContainer };
};

export const useAppHeaderStyles = () => {
  const theme = useTheme();

  const appBarButtons = {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.background.headerButtons,
    '& svg': {
      fontSize: '1.5rem',
    },
    '&:hover': {
      backgroundColor: theme.palette.background.default,
    }
  };
  const profileAppBar = {
    backgroundColor: 'transparent !important',
    maxWidth: 550,
    margin: 'auto',
    left: 0,
    right: 0,
  };
  const offlineChip = {
    backgroundColor: theme.palette.background.reverse,
    color: theme.palette.background.default,
    position: 'absolute',
    left: 0,
    right: 0,
    width: 130,
    margin: 'auto',
    bottom: 'auto',
    top: theme.spacing(2),
    opacity: 0.75,
    '& .MuiSvgIcon-root': {
      color: theme.palette.background.default,
    },
  };

  const appBarRoot = {
    backgroundColor: `${theme.palette.background.default} !important`,
    backgroundImage: 'none !important',
    boxShadow: '0 0 0 transparent !important',
    maxWidth: 550,
    margin: '0 auto',
    '& .MuiToolbar-root': {
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(1.5),
      minHeight: theme.spacing(7),
    },
    '& .appBarButtons': {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.background.headerButtons,
      '& svg': {
        fontSize: '1.5rem',
      },
    },
    '& .profileAppBar': {
      backgroundColor: 'transparent !important',
      maxWidth: 550,
      margin: 'auto',
      left: 0,
      right: 0,
    },
    '& .offlineChip': {
      backgroundColor: theme.palette.background.reverse,
      color: theme.palette.background.default,
      position: 'absolute',
      left: 0,
      right: 0,
      width: 130,
      margin: 'auto',
      bottom: 'auto',
      top: theme.spacing(2),
      opacity: 0.75,
      '& .MuiSvgIcon-root': {
        color: theme.palette.background.default,
      },
    },
  };

  const modeButton = {
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.background.headerButtons,
      height: 40,
      width: 90,
      borderRadius: 100,
      textTransform: 'initial',
      '& svg': {
        fontSize: '1.5rem',
      },
      '&:hover': {
        backgroundColor: theme.palette.background.default,
      }
    }
  }

  return { appBarRoot, appBarButtons, profileAppBar, offlineChip, modeButton };
};

export const useSaveButtonStyles = () => {
  const theme = useTheme();

  const saveButtonSuccess = {
    backgroundColor: `${theme.palette.background.green} !important`,
    '& svg': {
      color: '#fff !important',
    },
  };
  const saveButtonError = {
    backgroundColor: `${theme.palette.background.danger} !important`,
    '& svg': {
      color: '#fff !important',
    },
  };

  const saveButton = {
    maxWidth: 550,
    '&.saveButtonSuccess': {
      backgroundColor: `${theme.palette.background.green} !important`,
      '& svg': {
        color: '#fff !important',
      },
    },
    '&.saveButtonError': {
      backgroundColor: `${theme.palette.background.danger} !important`,
      '& svg': {
        color: '#fff !important',
      },
    },
  };

  const buttonProgress = {
    color: theme.palette.background.buttonProgress,
    marginRight: theme.spacing(1)
  }

  return { saveButton, saveButtonSuccess, saveButtonError, buttonProgress };
};

export const useSideMenuStyles = () => {
  const theme = useTheme();

  const sideMenuPaper = {
    '& > .MuiPaper-root': {
      width: 230,
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.default,
      '& .MuiList-root': {
        padding: 0,
      }
    }
  };

  const switchButton = {
    borderRadius: 100,
    marginBottom: theme.spacing(1),
    width: '100%',
    textTransform: 'initial',
    padding: theme.spacing(1),
  };

  const switchButtonsContainer = {};

  const switchDialogButton = {
    '& .MuiListItemText-root': {
      textTransform: 'capitalize',
    },
  };

  const accordionRoot = {
    boxShadow: '0 0 0 transparent',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    '::before': {
      backgroundColor: 'transparent',
    },
    '& .MuiCollapse-root .MuiAccordionDetails-root': {
      padding: 0,
      '& .MuiList-root .MuiButtonBase-root': {
        paddingLeft: 0,
        paddingRight: 0,
        '& .MuiListItemIcon-root': {
          color: theme.palette.background.accordionButtonIcon,
          minWidth: 30,
        },
        '& .MuiListItemText-root': {
          textTransform: 'capitalize',
        },
        '&.Mui-selected': {
          backgroundColor: 'transparent',
          '& .MuiListItemIcon-root': {
            color: theme.palette.background.accordionButtonIconSelected,
          },
        },
        '::hover': {
          backgroundColor: 'transparent',
        },
      },
    },
    '& .MuiAccordionSummary-root': {
      backgroundColor: 'transparent',
      border: 'none',
    },
    '& .MuiAccordionDetails-root': {
      backgroundColor: 'transparent',
    },
  };

  const accordionSummaryRoot = {
    padding: 0,
    '& .MuiAccordionSummary-content': {
      marginTop: 0,
      marginBottom: 0,
      '& .MuiListItemText-root .MuiTypography-root': {
        textTransform: 'capitalize',
        fontWeight: 600,
      },
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
      color: theme.palette.background.accordionIcon,
    },
    '& .Mui-expanded': {
      minHeight: 30,
    },
  };

  const menuLinksList = {
    '& .MuiButtonBase-root': {
      paddingLeft: 0,
      paddingRight: 0,
      '& .MuiListItemIcon-root': {
        color: theme.palette.background.accordionButtonIcon,
        minWidth: 30,
      },
      '& .MuiListItemText-root': {
        textTransform: 'capitalize',
      },
      '&.Mui-selected': {
        backgroundColor: 'transparent',
        '& .MuiListItemIcon-root': {
          color: theme.palette.background.accordionButtonIconSelected,
        },
      },
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  };

  return {
    sideMenuPaper,
    switchButton,
    switchButtonsContainer,
    switchDialogButton,
    accordionRoot,
    accordionSummaryRoot,
    menuLinksList
  };
};

export const useBottomNavStyles = (selectedColor: string | null) => {
  const theme = useTheme();

  const navContainer = {
    maxWidth: 550,
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
    borderRadius: `${theme.spacing(2)} ${theme.spacing(2)} 0 0`,
    zIndex: 2,
  }

  const bottomNavigation = {
    backgroundColor: theme.palette.background.panel,
    borderRadius: `${theme.spacing(2)} ${theme.spacing(2)} 0 0`,
    '& button': {
      '&.MuiButtonBase-root': {
        color: theme.palette.background.reverse,
        '&.Mui-selected': {
          color: selectedColor || theme.palette.background.blue
        }
      }
    }
  }

  const menuButton = {
    color: '#fff',
    '& .MuiBottomNavigationAction-label': {
      position: 'absolute',
      bottom: theme.spacing(1)
    },
    '&.Mui-selected': {
      '& .MuiSvgIcon-root': {
        color: '#fff'
      },
    }
  }

  const menuButtonIcon = {
    position: 'absolute',
    width: 60,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: selectedColor || theme.palette.background.blue,
    border:`4px solid ${theme.palette.background.default}`,
    borderRadius: '50%',
    top: -30,
    '& svg': {
      color: '#fff',
      fontSize: 28,
    }
  }

  return { navContainer, bottomNavigation, menuButton, menuButtonIcon };
};



