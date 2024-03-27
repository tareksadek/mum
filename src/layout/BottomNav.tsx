import React, { useState } from 'react';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import StorefrontIcon from '@mui/icons-material/Storefront';

import { useSBottomNavStyles } from './appStyles';

interface BottomNavProps {
  value: number | 0;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}

const BottomNav: React.FC<BottomNavProps> = ({ value, setValue }) => {
  const classes = useSBottomNavStyles();
  console.log(value)
  
  return (
    <Box sx={classes.navContainer}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={classes.bottomNavigation}
      >
        <BottomNavigationAction label="About" icon={<RestaurantMenuIcon />} />
        <BottomNavigationAction
          label="Menu"
          icon={<Box sx={classes.menuButtonIcon}><MenuBookIcon /></Box>}
          sx={classes.menuButton}
        />
        <BottomNavigationAction label="Contact" icon={<StorefrontIcon />} />
      </BottomNavigation>
    </Box>
  );
}

export default BottomNav;
