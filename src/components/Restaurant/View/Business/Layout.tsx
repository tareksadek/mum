import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import { RestaurantDataType } from '../../../../types/restaurant';
import Header from './Header'
import About from '../About'
import Video from '../Video'
import Info from '../Info'
import ActionButtons from '../ActionButtons'
import CustomLinks from '../CustomLinks';
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
        <Box width="100%">
          <Box width="100%">
            {loadingRestaurant && !restaurantLinks && (
              <Box mt={2} mb={2} width="100%" display="flex" alignItems="center" justifyContent="center">
                <CircularProgress />
              </Box>
            )}

            {restaurantLinks && restaurantLinks.custom && restaurantLinks.custom.length > 0 && (
              <Box mt={2} mb={2} width="100%">
                <CustomLinks
                  restaurant={restaurant}
                  restaurantLinks={restaurantLinks}
                />
              </Box>
            )}
          </Box>

          {restaurant.aboutData && restaurant.aboutData.about && (
            <Box mt={2} mb={2} width="100%">
              <About restaurant={restaurant} />
            </Box>
          )}

          {restaurant && restaurant.aboutData && restaurant.aboutData.videoUrl && (
            <Box mt={2} mb={2} width="100%">
              <Video restaurant={restaurant} />
            </Box>
          )}
        </Box>
      )}

      {pageValue === 1 && (
        <MenuContainer />
      )}

      {pageValue === 2 && (
        <Box width="100%">
          <Box mb={2} width="100%">
            <ActionButtons
              buttonStyles={{
                layout: 'divided',
                buttonStyle: 'rounded'
              }}
              restaurant={restaurant}
            />
          </Box>

          <Box mt={2} width="100%">
            <Info restaurant={restaurant} withSocialLinks={true} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Layout;
