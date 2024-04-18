import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Link } from '@mui/material';
import { useTheme } from '../contexts/ThemeContext';

import AppContentContainer from './AppContentContainer';
import RestaurantHeader from './RestaurantHeader';
import AppSideMenu from './AppSideMenu';
import BottomNav from './BottomNav';
import BusinessLayout from '../components/Restaurant/View/Business/Layout';
import DefaultLayout from '../components/Restaurant/View/Default/Layout';

import { authSelector } from '../store/selectors/auth';
import { restaurantSelector } from '../store/selectors/restaurant';
import { menuSelector } from '../store/selectors/menu';
import { RootState, AppDispatch } from '../store/reducers';
import { openModal, closeModal } from '../store/reducers/modal';
import { RestaurantDataType } from '../types/restaurant';
import useAuth from '../hooks/useAuth';
import { fetchRestaurantLinks } from '../store/reducers/restaurant';
import { fetchRestaurantMenu } from '../store/reducers/menu'; 
import { setMode } from '../store/reducers/appMode';
import { useAppStyles } from './appStyles';

interface AppLayoutProps {
  restaurant: RestaurantDataType;
}

const RestaurantLayout: React.FC<AppLayoutProps> = ({ restaurant }) => {
  const classes = useAppStyles();
  const dispatch = useDispatch<AppDispatch>(); 
  const [pageValue, setPageValue] = useState(1);
  const { setSpecificTheme } = useTheme(); 
  const { loadingAuth, isAdmin } = useAuth();
  const { menuId } = useSelector(menuSelector)

  const { isLoggedIn } = useSelector(authSelector);
  const openModalName = useSelector((state: RootState) => state.modal.openModal);
  const didModeChange = useSelector((state: RootState) => state.mode.didChange);

  const isSideMenuOpen = openModalName === 'sideMenu';

  const handlePopState = useCallback((event: PopStateEvent) => {
    if (openModalName) {
      dispatch(closeModal());
      event.preventDefault();
    }
  }, [openModalName, dispatch]);

  useEffect(() => {
      if (openModalName) {
          window.history.pushState(null, "", window.location.pathname);
          window.addEventListener("popstate", handlePopState);
      }
      return () => {
          window.removeEventListener("popstate", handlePopState);
      };
  }, [openModalName, handlePopState]);

  useEffect(() => {
    const handleBackButton = (event: any) => {
      if (isSideMenuOpen) {
        dispatch(closeModal());
        event.preventDefault();
      }
    };
  
    window.addEventListener('popstate', handleBackButton);
    return () => window.removeEventListener('popstate', handleBackButton);
  }, [isSideMenuOpen, dispatch]);

  useEffect(() => {
    if (restaurant && restaurant.themeSettings) {            
      setSpecificTheme(restaurant.themeSettings.theme)
    }
  }, [restaurant, setSpecificTheme]);

  useEffect(() => {
    if (isLoggedIn && !didModeChange) {  
      dispatch(setMode('edit'))
    }
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    if (restaurant.userId && restaurant.id) {
      dispatch(fetchRestaurantLinks({ userId: restaurant.userId, restaurantId: restaurant.id }))
      if (restaurant.activeMenuId && !menuId) {
        dispatch(fetchRestaurantMenu({ userId: restaurant.userId, restaurantId: restaurant.id, menuId: restaurant.activeMenuId }))
      }
    }
  }, [dispatch, restaurant, menuId]);

  const toggleDrawer = useCallback(() => {
    if (isSideMenuOpen) {
      dispatch(closeModal());
    } else {
      dispatch(openModal('sideMenu'));
    }
  }, [dispatch, isSideMenuOpen]);

  const getLayoutComponent = () => {
    switch (restaurant && restaurant.themeSettings && restaurant.themeSettings.layout) {
      case 'business':
        return <BusinessLayout pageValue={pageValue} restaurant={restaurant} />;
      case 'social':
        return <BusinessLayout pageValue={pageValue} restaurant={restaurant} />;
      case 'card':
        return <BusinessLayout pageValue={pageValue} restaurant={restaurant} />;
      default:
        return <DefaultLayout pageValue={pageValue} restaurant={restaurant} />;
    }
  };
  
  return (
    <Box sx={classes.mainBox}>
      <RestaurantHeader
        isLoggedIn={isLoggedIn}
        onMenuButtonClick={toggleDrawer}
      />

      <AppContentContainer>
        {getLayoutComponent()}
        <Link
          href="https://contactdyn.com"
          target="_blank"
          sx={classes.link}
        >
          Powered By CDYN
        </Link>
      </AppContentContainer>

      <AppSideMenu
        isOpen={isSideMenuOpen}
        toggleDrawer={toggleDrawer}
      />

      <BottomNav
        value={pageValue}
        setValue={setPageValue}
      />
    </Box>
  );
}

export default RestaurantLayout;
