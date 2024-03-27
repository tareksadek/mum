import React, { ReactNode, useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useMenuSectionStyles } from './styles';

interface MenuSectionProps {
  title: string | null;
  children: ReactNode;
  sectionId: string;
  expanded: string | boolean;
  expandedChange: (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
  image?: string | null;
}

const MenuSection: React.FC<MenuSectionProps> = ({
  title,
  children,
  sectionId,
  expanded,
  expandedChange
}) => {
  const classes = useMenuSectionStyles()

  return (
    <Box >
      <Accordion
        sx={classes.accordionContainer}
        expanded={expanded === sectionId}
        onChange={(event, isExpanded) => expandedChange(sectionId)(event, isExpanded)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
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
                  display="flex"
                  alignItems="center"
                >
                  <Box ml={1} display="flex" alignItems="center" gap={1}>
                    <Typography variant="body1" align="left">
                      {title}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </AccordionSummary>
        <Box
          sx={{ ...classes.accordionDetails, display: `${expanded ? 'block' : 'none'}` }}
        >
          <AccordionDetails>
            {children}
          </AccordionDetails>
        </Box>
      </Accordion>
    </Box>
  );
}

export default MenuSection;