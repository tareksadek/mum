import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../reducers';

const restaurantState = (state: RootState) => state.restaurant.restaurant;
const restaurantIdState = (state: RootState) => state.restaurant.restaurant?.id;
const restaurantThemeState = (state: RootState) => state.restaurant.restaurant?.themeSettings;
const restaurantVideoState = (state: RootState) => state.restaurant.restaurant?.aboutData?.videoUrl;
const restaurantActiveMenuIdState = (state: RootState) => state.restaurant.restaurant?.activeMenuId;
const restaurantLinksState = (state: RootState) => state.restaurant.restaurant?.links;
const restaurantWorkingDaysState = (state: RootState) => state.restaurant.restaurant?.workingDays?.workingDays;
const restaurantMenusState = (state: RootState) => state.restaurant.restaurant?.menus;
const getLoadingRestaurant = (state: RootState) => state.restaurant.loading;

export const restaurantSelector = createSelector(
  [restaurantState, restaurantIdState, restaurantThemeState, restaurantVideoState, restaurantActiveMenuIdState, restaurantLinksState, restaurantWorkingDaysState, restaurantMenusState, getLoadingRestaurant],
  (restaurant, restaurantId, restaurantTheme, restaurantVideo, activeMenuId, restaurantLinks, workingDays, restaurantMenus, loadingRestaurant) => ({
    restaurant,
    restaurantId,
    restaurantTheme,
    restaurantVideo,
    activeMenuId,
    restaurantLinks,
    workingDays,
    restaurantMenus,
    loadingRestaurant
  })
);
