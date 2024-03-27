import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Skeleton, Button } from '@mui/material';
import { authSelector } from '../../../store/selectors/auth';
import { menuSelector } from '../../../store/selectors/menu';
import { AppDispatch } from '../../../store/reducers';
import { openModal } from '../../../store/reducers/modal';
import { MenuItemType, MenuSectionType, MenuFilterType } from '../../../types/menu';

import { dietaryRestrictions, portionSizes, spicinessLevels, servingTemperatures, dishTypes } from '../../../setup/setup';

import MenuSections from './MenuSections';
import MenuFilterDialog from './MenuFilterDialog';

const MenuContainer = () => {
  const [filteredMenuSections, setFilteredMenuSections] = useState<MenuSectionType[] | null>(null)
  const [filterValues, setFilterValues] = useState<MenuFilterType | null>(null)
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useSelector(authSelector);
  const { menu, menuSections, loadingMenu } = useSelector(menuSelector);

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
  
  console.log(filteredMenuSections)

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
            <Box>
              <Box mb={2}>
                <Typography align='center' variant='h3'>{menu.name}</Typography>
              </Box>
              <Box>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  mb={2}
                  gap={2}
                >
                  <Box width="100%">
                    <Button
                      onClick={openMenuFilter}
                      variant="contained"
                      color="secondary"
                      fullWidth
                    >
                      Filter Menu
                    </Button>
                  </Box>
                  <Box width="100%">
                    <Button
                      onClick={clearMenuFilter}
                      variant="outlined"
                      color="secondary"
                      fullWidth
                    >
                      Clear Filter
                    </Button>
                  </Box>
                </Box>
                {filterValues && (
                  <Box>
                    <Typography align='left' variant='h4'>Current Filters:</Typography>
                    {filterValues.price && filterValues.price !== '' && (
                      <Box>
                        <Typography align='left' variant='body1'>
                          <b>Max Price:</b>
                          {filterValues.price}
                        </Typography>
                      </Box>
                    )}

                    {filterValues.dietaryRestrictions && filterValues.dietaryRestrictions.length > 0 && (
                      <Box>
                        <Typography align='left' variant='body1'>
                          <b>Diet:</b>
                          {filterValues.dietaryRestrictions
                            .map(restrictionId => dietaryRestrictions
                              .find(restriction => restriction.id === restrictionId)?.name)
                                .filter(name => name).join(" - ")}
                        </Typography>
                      </Box>
                    )}

                    {filterValues.types && filterValues.types.length > 0 && (
                      <Box>
                        <Typography align='left' variant='body1'>
                          <b>Meal Type:</b>
                          {filterValues.types
                            .map(typeId => dishTypes
                              .find(type => type.id === typeId)?.name)
                                .filter(name => name).join(" - ")}
                        </Typography>
                      </Box>
                    )}

                    {filterValues.size && filterValues.size !== '' && (
                      <Box>
                        <Typography align='left' variant='body1'>
                          <b>Portion Size:</b>
                          {portionSizes.find(size => size.id === filterValues.size)?.name}
                        </Typography>
                      </Box>
                    )}

                    {filterValues.spiciness && filterValues.spiciness !== '' && (
                      <Box>
                        <Typography align='left' variant='body1'>
                          <b>Spiciness:</b>
                          {spicinessLevels.find(level => level.id === filterValues.spiciness)?.name}
                        </Typography>
                      </Box>
                    )}

                    {filterValues.temperature && filterValues.temperature !== '' && (
                      <Box>
                        <Typography align='left' variant='body1'>
                          <b>Spiciness:</b>
                          {servingTemperatures.find(temperature => temperature.id === filterValues.temperature)?.name}
                        </Typography>
                      </Box>
                    )}
                    
                  </Box>
                )}
              </Box>
              <MenuSections
                sections={visibleSections}
              />
            </Box>
          ) : (
            <Box>No Menu Create one</Box>
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