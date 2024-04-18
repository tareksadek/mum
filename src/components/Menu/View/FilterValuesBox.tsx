import React from 'react'
import { useSelector } from 'react-redux';
import { Box, Typography, Button } from '@mui/material';
import { restaurantSelector } from '../../../store/selectors/restaurant';
import { menuSelector } from '../../../store/selectors/menu';
import { MenuFilterType } from '../../../types/menu';

import { dietaryRestrictions, portionSizes, spicinessLevels, servingTemperatures, dishTypes, currencies } from '../../../setup/setup';
import { SpicenessIcon, TemperatureIcon, SizeIcon } from '../../../layout/CustomIcons';

import { useFilterValueBoxStyles } from './styles';
import { useLayoutStyles } from '../../../theme/layout';

type FilterValueBoxProps = {
  filterValues: MenuFilterType | null;
  onClearFilter: () => void;
}

const FilterValueBox: React.FC<FilterValueBoxProps> = ({ filterValues, onClearFilter }) => {
  const { restaurantTheme } = useSelector(restaurantSelector);
  const { menuCurrency } = useSelector(menuSelector)
  const themeColorName = restaurantTheme ? restaurantTheme.selectedColor.name : null
  const themeColorCode = restaurantTheme ? restaurantTheme.selectedColor.code : null
  const backgroundColor = themeColorName !== 'grey' && themeColorCode ? themeColorCode : null;
  const classes = useFilterValueBoxStyles(backgroundColor)
  const layoutClasses = useLayoutStyles()


  return (
    <Box>
      {filterValues && (
        <Box m={1} sx={layoutClasses.panel}>
          {filterValues.price && filterValues.price !== '' && (
            <Box>
              <Typography align='left' variant='body1'>
                Showing items with Price up to &nbsp;
                <b>
                  {menuCurrency && menuCurrency !== '' ? currencies.find(currency => currency.code === menuCurrency)?.symbol : '$'}
                  {filterValues.price}
                </b>
              </Typography>
            </Box>
          )}

          {filterValues.dietaryRestrictions && filterValues.dietaryRestrictions.length > 0 && (
            <Box>
              <Typography align='left' variant='body1'>
                With&nbsp;
                <b>
                  {filterValues.dietaryRestrictions
                    .map(restrictionId => dietaryRestrictions
                      .find(restriction => restriction.id === restrictionId)?.name)
                        .filter(name => name).join(" - ")}
                </b>
                &nbsp;Diet
              </Typography>
            </Box>
          )}

          {filterValues.types && filterValues.types.length > 0 && (
            <Box>
              <Typography align='left' variant='body1'>
                And is&nbsp;
                <b>
                  {filterValues.types
                    .map(typeId => dishTypes
                      .find(type => type.id === typeId)?.name)
                        .filter(name => name).join(" - ")}
                </b>
              </Typography>
            </Box>
          )}


          <Box
            display="flex"
            alignItems="center"
            gap={2}
            flexWrap="wrap"
          >
            {filterValues.size && filterValues.size !== '' && (
              <Box
                display="flex"
                alignItems="center"
                mt={1}
                mb={1}
                gap={1}
              >
                <Box
                  sx={classes.itemTipIconContainer}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <SizeIcon />
                </Box>
                <Typography align='left' variant='body1'>
                  {portionSizes.find(size => size.id === filterValues.size)?.name}
                </Typography>
              </Box>
            )}

            {filterValues.spiciness && filterValues.spiciness !== '' && (
              <Box
                display="flex"
                alignItems="center"
                mt={1}
                mb={1}
                gap={1}
              >
                <Box
                  sx={classes.itemTipIconContainer}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <SpicenessIcon />
                </Box>
                <Typography align='left' variant='body1'>
                  {spicinessLevels.find(level => level.id === filterValues.spiciness)?.name}
                </Typography>
              </Box>
            )}

            {filterValues.temperature && filterValues.temperature !== '' && (
              <Box
                display="flex"
                alignItems="center"
                mt={1}
                mb={1}
                gap={1}
              >
                <Box
                  sx={classes.itemTipIconContainer}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <TemperatureIcon />
                </Box>
                <Typography align='left' variant='body1'>
                  {servingTemperatures.find(temperature => temperature.id === filterValues.temperature)?.name}
                </Typography>
              </Box>
            )}
          </Box>

          <Box width="100%">
            <Button
              onClick={onClearFilter}
              variant="outlined"
              color="secondary"
              fullWidth
            >
              Clear Filter
            </Button>
          </Box>
          
        </Box>
      )}
    </Box>
  );
}

export default FilterValueBox;