import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { format } from 'date-fns';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/reducers';
import { Box, CircularProgress, Alert } from '@mui/material';
import { updateUser } from '../store/reducers/user';
import { updateRestaurant } from '../store/reducers/restaurant'; 
import { updateSetup } from '../store/reducers/setup';
import { getUserByRestaurantSuffix } from '../API/user'; 
import { fetchRestaurantById } from '../API/restaurant';
import { UserType } from '../types/user';
import { StaticSetup, FetchedSetup, SetupType } from '../types/setup';
import { RestaurantDataType } from '../types/restaurant';
import RestaurantLayout from '../layout/RestaurantLayout';
import AppContentContainer from '../layout/AppContentContainer';
import { defaults, main, appDomain } from '../setup/setup';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const restaurantSuffix = context.params?.restaurantSuffix as string;
    if (!restaurantSuffix) {
      return {
        props: {
          userData: null,
          restaurantData: null,
          error: 'Missing restaurant suffix.',
        },
      };
    }
    
    const userDataResponse = await getUserByRestaurantSuffix(restaurantSuffix);

    if (!userDataResponse.success) {
      throw new Error('Failed to fetch user data');
    }
    
    const formattedUserData = {
      ...userDataResponse.data,
      createdOn: userDataResponse.data.createdOn ? format(new Date(userDataResponse.data.createdOn), 'yyyy-MMM-dd') : null,
      lastLogin: userDataResponse.data.lastLogin ? format(new Date(userDataResponse.data.lastLogin), 'yyyy-MMM-dd') : null,
      redirect: userDataResponse.data.redirect || null
    };
    
    const restaurantDataResponse = await fetchRestaurantById(userDataResponse.data.id, userDataResponse.data.activeRestaurantId);
    if (!restaurantDataResponse.success) {
      throw new Error('Failed to fetch restaurant data');
    }

    return {
      props: {
        userData: formattedUserData,
        restaurantData: restaurantDataResponse.data,
        error: null,
      },
    };
  } catch (error) {
    return {
      props: {
        userData: null,
        restaurantData: null,
        error: (error instanceof Error) ? error.message : 'Restaurant Does Not Exist.',
      },
    };
  }
};

type RestaurantProps = {
  userData: UserType; 
  restaurantData: RestaurantDataType;
  error?: string | null;
}

const Restaurant: React.FC<RestaurantProps> = ({ userData, restaurantData, error }) => {
  const user = userData
  const restaurant = restaurantData  
  const loggedIn = useSelector((state: RootState) => state.authUser.isLoggedIn); 
  const authId = useSelector((state: RootState) => state.authUser.userId); 
  const isAccountOwner = loggedIn && (authId === user?.id)

  const dispatch = useDispatch<AppDispatch>();

  const generateMetaData = () => {
    const metaData = {
      restaurantName: '',
      restaurantDescription: '',
      restaurantImage: '',
      restaurantPage: ''
    }
    if (restaurant) {
      metaData.restaurantName = `${restaurant?.basicInfoData?.firstName || ''} ${restaurant?.basicInfoData?.lastName || ''}`;
      metaData.restaurantDescription = `${restaurant?.aboutData?.about || ''}`;
      metaData.restaurantImage = restaurant.profileImageData?.url || '/images/logo512.jpg';
      metaData.restaurantPage = `${appDomain}/${userData.profileUrlSuffix}`
    }
    return metaData
  }

  const pageMeta = generateMetaData()

  useEffect(() => {
    const staticSetupData: SetupType = {
      ...defaults as StaticSetup,
      ...main as FetchedSetup
    };
    if (user) {
      dispatch(updateSetup(staticSetupData))
      dispatch(updateUser(user));
    }
    if (user && restaurant) {
      dispatch(updateRestaurant(restaurant))
    }
  }, [dispatch, user, restaurant]);

  if (!error && (!user || !restaurant)) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }    

  if (error && (!user || !restaurant)) {
    return (
      <Box mt={2}>
        <AppContentContainer>
          <Alert severity="error">{error}</Alert>
        </AppContentContainer>
      </Box>
    );
  }

  if (restaurant) {
    return (
      <>
        <Head>
          <title>{pageMeta.restaurantName}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content={pageMeta.restaurantDescription} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={pageMeta.restaurantPage} />
          <meta property="og:title" content={pageMeta.restaurantName} />
          <meta property="og:description" content={pageMeta.restaurantDescription} />
          <meta property="og:image" content={pageMeta.restaurantImage} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content={pageMeta.restaurantPage} />
          <meta name="twitter:title" content={pageMeta.restaurantName} />
          <meta name="twitter:description" content={pageMeta.restaurantDescription} />
          <meta name="twitter:image" content={pageMeta.restaurantImage} />
        </Head>
        <RestaurantLayout restaurant={restaurant} />
      </>
    );
  }
}

export default Restaurant;
