import React from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/reducers';
import { placeHolderProfileImage } from '../../../../setup/setup';
import { useDefaultHeaderStyles } from '../styles';
import { RestaurantDataType } from '../../../../types/restaurant';
import EditableSection from '../../../../layout/EditableSection';
import AddSectionButton from '../../../../layout/AddSectionButton';
import EditLogoSection from '../../../../layout/EditLogoSection';

type HeaderProps = {
  restaurant: RestaurantDataType;
}

const Header: React.FC<HeaderProps> = ({ restaurant }) => {
  const classes = useDefaultHeaderStyles()
  const setup = useSelector((state: RootState) => state.setup.setup);
  const themeColorCode = restaurant?.themeSettings ? restaurant?.themeSettings.selectedColor.code : ''

  let coverImage;

  if (setup && setup.coverImageData && setup.coverImageData.url) {
    coverImage = setup.coverImageData.url;
  } else if (restaurant && restaurant.coverImageData && restaurant.coverImageData.url) {
    coverImage = restaurant.coverImageData.url;
  }

  return (
    <Box width="100%" maxWidth={550} sx={classes.headerContainer}>
      <Box sx={classes.imagesContainer} mb={8}>
        <Box
          sx={classes.coverImageContainer}
          maxWidth={550}
          minHeight={200}
          width="100%"
          style={{
            backgroundColor: themeColorCode,
          }}
        >
          {coverImage && (
            <Box sx={{ position: 'relative', width: '100%', height: 265 }}>
              {/* <Image
                src={coverImage}
                alt={`${restaurant ? restaurant.basicInfoData?.firstName : ''} ${restaurant ? restaurant.basicInfoData?.lastName : ''} cover`}
                fill
                priority
                style={{
                  objectFit: 'cover',
                }}
              /> */}
              <img
                src={coverImage}
                alt={`${restaurant ? restaurant.basicInfoData?.firstName : ''} ${restaurant ? restaurant.basicInfoData?.lastName : ''} cover`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          )}
        </Box>
        <Box
          sx={classes.profileImageContainer}
          width={106}
          height={106}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Avatar
            src={restaurant && restaurant.profileImageData && restaurant.profileImageData.url ? restaurant.profileImageData.url : placeHolderProfileImage}
            alt={`${restaurant ? restaurant.basicInfoData?.firstName : ''} ${restaurant ? restaurant.basicInfoData?.lastName : ''} restaurant`}
            sx={{ width: 100, height: 100 }}
          />

          <EditLogoSection linkTo='/images' />
        </Box>
      </Box>
      
      <AddSectionButton linkTo='/theme' text='Change theme' mb={2} />

      <Box mb={2}>
        <EditableSection linkTo='/info' defaultButton>
          <Box>
            <Typography variant="h1" align="center">
              {restaurant && restaurant.basicInfoData && restaurant.basicInfoData.firstName ? restaurant.basicInfoData.firstName : ''}
              {restaurant && restaurant.basicInfoData && restaurant.basicInfoData.lastName ? ` ${restaurant.basicInfoData.lastName}` : ''}
            </Typography>
            {restaurant && restaurant.basicInfoData && restaurant.basicInfoData.slogan && (
              <Box sx={classes.sloganContainer} mt={0.5}>
                <Typography variant="body1" align="center">
                  {restaurant.basicInfoData.slogan}
                </Typography>
              </Box>
            )}
          </Box>
        </EditableSection>
      </Box>
    </Box>
  );
};

export default Header;
