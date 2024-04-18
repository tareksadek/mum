import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { RestaurantDataType } from '../../../../types/restaurant';
import Header from './Header'
import AboutSection from '../AboutSection';
import ContactSection from '../ContactSection';
import MenuContainer from '../../../../components/Menu/View/MenuContainer';
import { restaurantSelector } from '../../../../store/selectors/restaurant';

type LayoutProps = {
  restaurant: RestaurantDataType;
  pageValue: number | 0;
}

const Layout: React.FC<LayoutProps> = ({ restaurant, pageValue }) => {
  const { restaurantLinks, loadingRestaurant } = useSelector(restaurantSelector);
  
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >

      <Header
        restaurant={restaurant}
        loadingRestaurant={loadingRestaurant}
        restaurantLinks={restaurantLinks}
      />

      {pageValue === 0 && (
        <AboutSection restaurant={restaurant} />
      )}

      {pageValue === 1 && (
        <MenuContainer />
      )}

      {pageValue === 2 && (
        <ContactSection restaurant={restaurant} />
      )}
    </Box>
  );
};

export default Layout;
