import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../reducers';

const menuState = (state: RootState) => state.menu.menu;
const menuIdState = (state: RootState) => state.menu.menu?.id;
const menuSectionsState = (state: RootState) => state.menu.menu?.sections;
const getLoadingMenu = (state: RootState) => state.menu.loading;
const getSortingMenu = (state: RootState) => state.menu.sorting;
const getEditingMenu = (state: RootState) => state.menu.editing;
const getCreatingMenu = (state: RootState) => state.menu.creating;

export const menuSelector = createSelector(
  [menuState, menuIdState, menuSectionsState, getLoadingMenu, getSortingMenu, getEditingMenu, getCreatingMenu],
  (menu, menuId, menuSections, loadingMenu, sortingMenu, editingMenu, creatingMenu) => ({
    menu,
    menuId,
    menuSections,
    loadingMenu,
    sortingMenu,
    editingMenu,
    creatingMenu
  })
);