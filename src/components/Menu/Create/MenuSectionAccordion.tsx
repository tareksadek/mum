import React, { ReactNode, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Typography,
  Chip,
  IconButton,
  Accordion,
  AccordionActions,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MenuSectionMenu from './MenuSectionMenu';

import { menuSelector } from '../../../store/selectors/menu';

import { DragHandleIcon } from '../../../layout/CustomIcons';
import { useMenuSectionStyles } from './styles';

interface MenuSectionAccordionProps {
  title: string | null;
  children: ReactNode;
  buttonOneText?: string | null;
  buttonOneAction?: (id: string) => void;
  buttonTwoText?: string | null;
  buttonTwoAction?: (id: string) => void;
  buttonThreeText?: string | null;
  buttonThreeAction?: (sectionId: string, sectionName: string, sectionImageUrl: string | null) => void;
  sectionId: string;
  isActive: boolean | undefined;
  expanded: string | boolean;
  expandedChange: (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
  image?: string | null;
}

const MenuSectionAccordion: React.FC<MenuSectionAccordionProps> = ({
  title,
  children,
  buttonOneAction,
  buttonOneText,
  buttonTwoAction,
  buttonTwoText,
  buttonThreeAction,
  buttonThreeText,
  sectionId,
  isActive,
  expanded,
  expandedChange,
  image
}) => {
  const classes = useMenuSectionStyles()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dragAttemptWhileExpanded, setDragAttemptWhileExpanded] = useState(false);
  const open = Boolean(anchorEl);

  const { sortingMenu } = useSelector(menuSelector);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    if (expanded && expanded !== null) {
      event.preventDefault();
      setDragAttemptWhileExpanded(true);
      setTimeout(() => setDragAttemptWhileExpanded(false), 3000);
    }
  };

  return (
    <Box>
      <Accordion
        sx={classes.accordionContainer}
        expanded={expanded === sectionId}
        onChange={(event, isExpanded) => expandedChange(sectionId)(event, isExpanded)}
      >
        <AccordionSummary
          expandIcon={
            <Tooltip
              sx={classes.collapseTooltip}
              title="Collapse section to drag"
              open={dragAttemptWhileExpanded}
              arrow
              componentsProps={{
                popper: {
                  sx: classes.collapseTooltip 
                }
              }}
            >
              <ExpandMoreIcon />
            </Tooltip>
          }
          aria-controls={`${sectionId}-content`}
          id={`${sectionId}-header`}
          sx={classes.accordionSummary}
        >
          <Box
            width="100%"
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              width="100%"
            >
              <Box
                display="flex"
                alignItems="center"
              >
                <Box
                  sx={classes.sectionItemDragIcon}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  onMouseDown={handleMouseDown}
                >
                  {sortingMenu ? (
                    <CircularProgress size={25} />
                  ) : (
                    <DragHandleIcon />
                  )}
                </Box>
                
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{
                    ...(!isActive && classes.buttonContainerDisabled)
                  }}
                >
                  <Box ml={1} display="flex" alignItems="center" gap={1}>
                    <Typography variant="body1" align="left">
                      {title}
                    </Typography>
                    {!isActive && (
                      <Chip label="Inactive" size="small" sx={classes.inactiveChip} />
                    )}
                  </Box>
                </Box>
              </Box>
              <Box>
                <IconButton
                  aria-label="more"
                  id={`${sectionId}-button`}
                  aria-controls={open ? `${sectionId}-menu` : undefined}
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </AccordionSummary>
        <Box
          sx={{ ...classes.accordionDetails, display: `${expanded === sectionId ? 'block' : 'none'}` }}
        >
          <AccordionDetails>
            {/* {expanded === sectionId ? children : null } */}
            {children}
          </AccordionDetails>
          {buttonOneText && buttonOneAction && (
            <AccordionActions sx={classes.accordionActions}>
              <Box display="flex" alignItems="center">
                <Button
                  onClick={() => buttonOneAction(sectionId)}
                  startIcon={<EditNoteIcon />}
                  sx={classes.accordionActionButton}
                >
                  {buttonOneText}
                </Button>
                {buttonTwoText && buttonTwoAction && (
                  <Button
                    onClick={() => buttonTwoAction(sectionId)}
                    startIcon={<AddCircleIcon />}
                    sx={classes.accordionActionButton}
                  >
                    {buttonTwoText}
                  </Button>
                )}
              </Box>
              {buttonThreeText && buttonThreeAction && (
                <Button
                  onClick={() => buttonThreeAction(sectionId, title || 'this section', image || null)}
                  startIcon={<DeleteIcon />}
                  sx={classes.accordionActionButton}
                >
                  {buttonThreeText}
                </Button>
              )}
            </AccordionActions>
          )}
        </Box>
      </Accordion>
      <MenuSectionMenu
        title={title}
        image={image || null}
        anchorEl={anchorEl}
        open={open}
        handleClose={handleClose}
        sectionId={sectionId}
        buttonOneText={buttonOneText}
        buttonOneAction={buttonOneAction}
        buttonTwoText={buttonTwoText}
        buttonTwoAction={buttonTwoAction}
        buttonThreeText={buttonThreeText}
        buttonThreeAction={buttonThreeAction}
      />
    </Box>
  );
}

export default MenuSectionAccordion;