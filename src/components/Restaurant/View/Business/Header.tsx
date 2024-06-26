import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { placeHolderProfileImage } from '../../../../setup/setup';
import { useBusinessHeaderStyles } from '../styles';
import { RestaurantDataType, LinkType } from '../../../../types/restaurant';
import EditableSection from '../../../../layout/EditableSection';
import AddSectionButton from '../../../../layout/AddSectionButton';
import EditLogoSection from '../../../../layout/EditLogoSection';

type HeaderProps = {
  restaurant: RestaurantDataType;
  loadingRestaurant?: boolean;
  restaurantLinks?: {
    social: LinkType[],
    custom: LinkType[]
  };
}

const Header: React.FC<HeaderProps> = ({ restaurant, loadingRestaurant, restaurantLinks }) => {
  const classes = useBusinessHeaderStyles()
  const themeColorCode = restaurant?.themeSettings ? restaurant?.themeSettings.selectedColor.code : ''

  return (
    <Box width="100%" maxWidth={550} sx={classes.headerContainer}>
      <Box sx={classes.imagesContainer} mb={1} width="100%">
        <Box
          sx={classes.coverImageContainer}
          maxWidth={550}
          width="100%"
          minHeight={275}
          style={{
            backgroundColor: themeColorCode,
          }}
        >
          <Box sx={classes.dataContainer} pt={8} pl={2} maxWidth={250}>
            <EditableSection linkTo='/info' defaultButton>
              <Box>
                <Typography variant="h3" align="left">
                  {restaurant && restaurant.basicInfoData && restaurant.basicInfoData.firstName ? restaurant.basicInfoData.firstName : ''}
                  {restaurant && restaurant.basicInfoData && restaurant.basicInfoData.lastName ? ` ${restaurant.basicInfoData.lastName}` : ''}
                </Typography>
                {restaurant && restaurant.basicInfoData && restaurant.basicInfoData.slogan && (
                  <Typography variant="body1" align="left">
                    {restaurant.basicInfoData.slogan}
                  </Typography>
                )}
              </Box>
              {loadingRestaurant && !restaurantLinks && (
                <Box mt={2} mb={2} width="100%">
                  <CircularProgress size={20} style={{ color: '#fff' }} />
                </Box>
              )}
            </EditableSection>
          </Box>
        </Box>
        <Box
          sx={classes.profileImageContainer}
          width={131}
          height={131}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Avatar
            src={restaurant && restaurant.profileImageData && restaurant.profileImageData.url ? restaurant.profileImageData.url : placeHolderProfileImage}
            alt={`${restaurant ? restaurant.basicInfoData?.firstName : ''} ${restaurant ? restaurant.basicInfoData?.lastName : ''} profile`}
            sx={{ width: 125, height: 125 }}
          />

          <EditLogoSection linkTo='/images' />
        </Box>
      </Box>
      <AddSectionButton linkTo='/theme' text='Change theme' mb={2} />
    </Box>
  );
};

export default Header;
