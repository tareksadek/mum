import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../reducers';

const restaurantState = (state: RootState) => state.restaurant.restaurant;
const restaurantIdState = (state: RootState) => state.restaurant.restaurant?.id;
const restaurantLinksState = (state: RootState) => state.restaurant.restaurant?.links;
const restaurantMenusState = (state: RootState) => state.restaurant.restaurant?.menus;
const getLoadingRestaurant = (state: RootState) => state.restaurant.loading;

export const restaurantSelector = createSelector(
  [restaurantState, restaurantIdState, restaurantLinksState, restaurantMenusState, getLoadingRestaurant],
  (restaurant, restaurantId, restaurantLinks, restaurantMenus, loadingRestaurant) => ({
    restaurant,
    restaurantId,
    restaurantLinks,
    restaurantMenus,
    loadingRestaurant
  })
);
