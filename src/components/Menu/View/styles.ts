import { useTheme } from '@mui/material/styles';

export const useMenuSectionStyles = () => {
  const theme = useTheme();

  const accordionContainer = {
    padding: 0,
    boxShadow: '0 0 0 transparent',
  };

  const accordionSummary = {
    backgroundColor: theme.palette.background.listItem,
    border: `1px solid ${theme.palette.background.listItemBorder}`,
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(1),
    marginBottom: 0,
    '&:last-child': {
      marginBottom: 0
    },
    '& .MuiAccordionSummary-content': {
      padding: 0,
      margin: 0,
      '&.Mui-expanded': {
        margin: 0,
      }
    }
  }

  const collapseTooltip = {
    '& .MuiTooltip-tooltip': {
      backgroundColor: theme.palette.background.danger,
      color: '#fff',
      '& .MuiTooltip-arrow': {
        color: theme.palette.background.danger,
      }
    }
  }

  const accordionDetails = {
    border: `1px solid ${theme.palette.background.listItemBorder}`,
    borderTop: 'none',
    borderBottomLeftRadius: theme.spacing(0.5),
    borderBottomRightRadius: theme.spacing(0.5),
    display: 'none'
  }

  const accordionActions = {
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  }

  const accordionActionButton = {
    textTransform: 'none',
    marginLeft: '0 !important',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  }

  const buttonContainer = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: `${theme.spacing(1)} !important`,
    maxWidth: 50,
    '& .MuiListItemIcon-root': {
      minWidth: 50,
    },
    '& .MuiTypography-root': {
      fontSize: '0.75rem',
      textTransform: 'capitalize',
    },
  };

  const buttonContainerDisabled = {
    opacity: 0.5,
  };

  const sectionItemDragIcon = {
    color: theme.palette.background.listItemDragHandler,
    marginRight: theme.spacing(1),
  };

  const placeholderIconContainer = {
    backgroundColor: '#BEC9D8',
    borderRadius: '50%',
    width: 120,
    height: 120,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': {
      fontSize: 65,
    },
  };

  const inactiveChip = {
    backgroundColor: '#fff4e5',
    color: '#663c00'
  }

  const activeChip = {
    backgroundColor: '#edf7ed',
    color: '#1e4620'
  }

  return { 
    accordionContainer, 
    accordionSummary,
    collapseTooltip,
    accordionDetails,
    accordionActions,
    accordionActionButton,
    buttonContainer, 
    buttonContainerDisabled, 
    sectionItemDragIcon, 
    placeholderIconContainer,
    activeChip,
    inactiveChip,
  };
};

export const useMenuItemStyles = () => {
  const theme = useTheme();

  const filterSectionsContainer = {
    '& > div': {
      borderBottomStyle: 'solid',
      borderBottomWidth: 1,
      borderBottomColor: theme.palette.background.listItemBorder,
      '&:last-of-type': {
        border: 'none',
      }
    },
    '& legend': {
      fontWeight: 600,
      color: theme.palette.background.reverse,
    }
  };

  const menuItemContainer = {
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.background.listItemBorder}`,
    borderRadius: theme.spacing(0.5),
  }

  const linkItemDragIcon = {
    color: theme.palette.background.listItemDragHandler,
    marginRight: theme.spacing(1),
  };

  const inactiveChip = {
    backgroundColor: '#fff4e5',
    color: '#663c00'
  }

  const activeChip = {
    backgroundColor: '#edf7ed',
    color: '#1e4620'
  }

  const itemIconButton = {
    color: theme.palette.background.listItemIconButton
  };

  return { 
    filterSectionsContainer, 
    menuItemContainer,
    linkItemDragIcon,
    inactiveChip,
    activeChip,
    itemIconButton,
  };
};

export const useItemDetailsStyles = () => {
  const theme = useTheme();

  const imageSectionContainer = {
    position: 'relative',
    '&::before': {
      content:'""',
      position: 'absolute',
      width: '100%',
      left: 0,
      bottom: 0,
      background: 'linear-gradient(0deg, rgba(0,0,0,1) 25%, rgba(255,255,255,0) 100%)',
      zIndex: 1,
      borderRadius: `0 0 ${theme.spacing(2)} ${theme.spacing(2)}`,
      height: '30%',
    }
  }

  const itemNameInImageSection = {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: '#fff',
    bottom: 0,
    left: 0,
    zIndex: 2,
    '& p': {
      color: '#fff',
    },
    '& h4': {
      color: '#fff',
    }
  }

  const imageContainer = {
    maxWidth: 550,
    width: '100%',
    height: 0,
    paddingTop: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: `0 0 ${theme.spacing(2)} ${theme.spacing(2)}`
  };
  
  const ingredientsContainer = { 
    '& p': {
      textTransform: 'capitalize'
    },
  }

  return { 
    imageSectionContainer,
    imageContainer,
    itemNameInImageSection,
    ingredientsContainer
  };
};