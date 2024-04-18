import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Skeleton, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { authSelector } from '../../../store/selectors/auth';
import { menuSelector } from '../../../store/selectors/menu';
import { restaurantSelector } from '../../../store/selectors/restaurant';
import { AppDispatch } from '../../../store/reducers';
import { openModal } from '../../../store/reducers/modal';
import { MenuItemType, MenuSectionType, MenuFilterType } from '../../../types/menu';

import { dietaryRestrictions, portionSizes, spicinessLevels, servingTemperatures, dishTypes } from '../../../setup/setup';

import MenuSections from './MenuSections';
import MenuFilterDialog from './MenuFilterDialog';
import EditableSection from '../../../layout/EditableSection';
import AddSectionButton from '../../../layout/AddSectionButton';
import FilterValueBox from './FilterValuesBox';

import { useMenuContainerStyles } from './styles';

const MenuContainer = () => {
  const [filteredMenuSections, setFilteredMenuSections] = useState<MenuSectionType[] | null>(null)
  const [filterValues, setFilterValues] = useState<MenuFilterType | null>(null)
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector(authSelector);
  const { menu, menuSections, loadingMenu } = useSelector(menuSelector);
  const { restaurantTheme } = useSelector(restaurantSelector);
  const themeColorName = restaurantTheme ? restaurantTheme.selectedColor.name : null
  const themeColorCode = restaurantTheme ? restaurantTheme.selectedColor.code : null
  const backgroundColor = themeColorName !== 'grey' && themeColorCode ? themeColorCode : null;
  const classes = useMenuContainerStyles(backgroundColor)

  const visibleSections = menuSections ? [...menuSections].filter(section => 
    section.visible && section.items && section.items.some((item: MenuItemType)  => item.visible))
    .map(section => ({
      ...section,
      items: section.items && section.items.filter((item: MenuItemType) => item.visible)
    })) : null;

  const getMaxPrice = (): number => {
    if (visibleSections) {
      return visibleSections.reduce((max, section) => {
        const items = section.items ?? [];
        const maxPriceInSection = items.reduce((maxItemPrice, item) => {
          const itemPrice = item.newPrice ? parseFloat(item.newPrice) : 0;
          return Math.max(maxItemPrice, itemPrice);
        }, 0);
        return Math.max(max, maxPriceInSection);
      }, 0);
    }
    return 0;
  };
  
  const openMenuFilter = () => {
    dispatch(openModal('filterDialog'))
  }

  const clearMenuFilter = () => {
    setFilteredMenuSections(null)
    setFilterValues(null)
  }

  return (
    <Box width="100%">
      {loadingMenu ? (
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" width="100%">
          <Skeleton animation="wave" width="50%" height={50} />
          <Skeleton animation="wave" width="100%" height={70} />
          <Skeleton animation="wave" width="100%" height={70} />
          <Skeleton animation="wave" width="100%" height={70} />
          <Skeleton animation="wave" width="100%" height={70} />
        </Box>
      ) : (
        <>
          {menu ? (
            <EditableSection linkTo='/menus' defaultButton>
              <Box>
                <Box
                  mb={2}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={1}
                  pl={1}
                  pr={1}
                >
                  <Typography align='center' variant='h3'>{menu.name}</Typography>
                  <Button
                    onClick={openMenuFilter}
                    variant="contained"
                    startIcon={<FilterListIcon />}
                    sx={classes.filterButton}
                  >
                    Filter Menu
                  </Button>
                </Box>
                <Box>
                  {filterValues && (
                    <FilterValueBox
                      filterValues={filterValues}
                      onClearFilter={clearMenuFilter}
                    />
                  )}
                </Box>
                <MenuSections
                  sections={filteredMenuSections || visibleSections}
                />
              </Box>
            </EditableSection>
          ) : (
            <AddSectionButton linkTo='/menus' text='Create Your Menu' />
          )}
        </>
      )}

      <MenuFilterDialog
        maxPrice={getMaxPrice()}
        setFilteredMenuSections={setFilteredMenuSections}
        setFilterValues={setFilterValues}
        filterValues={filterValues}
        sections={visibleSections}
      />
      
    </Box>
  );
}

export default MenuContainer;