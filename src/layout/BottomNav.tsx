import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useSelector } from 'react-redux';
import { restaurantSelector } from '../store/selectors/restaurant';
import { AboutIcon, RestaurantMenuIcon, ContactIcon } from './CustomIcons';
import { useBottomNavStyles } from './appStyles';


interface BottomNavProps {
  value: number | 0;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}

const BottomNav: React.FC<BottomNavProps> = ({ value, setValue }) => {
  const { restaurantTheme } = useSelector(restaurantSelector);
  const themeColorName = restaurantTheme ? restaurantTheme.selectedColor.name : null
  const themeColorCode = restaurantTheme ? restaurantTheme.selectedColor.code : null
  const backgroundColor = themeColorName !== 'grey' && themeColorCode ? themeColorCode : null;
  const classes = useBottomNavStyles(backgroundColor);
  
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
        <BottomNavigationAction label="Info" icon={<AboutIcon />} />
        <BottomNavigationAction
          label="Menu"
          icon={<Box sx={classes.menuButtonIcon}><RestaurantMenuIcon /></Box>}
          sx={classes.menuButton}
        />
        <BottomNavigationAction label="Contact" icon={<ContactIcon />} />
      </BottomNavigation>
    </Box>
  );
}

export default BottomNav;
