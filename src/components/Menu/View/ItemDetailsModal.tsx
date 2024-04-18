import React, { useCallback } from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { menuSelector } from '../../../store/selectors/menu';
import { TransitionProps } from '@mui/material/transitions';
import { Box, Slide, IconButton, Typography, Dialog, Chip } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useLayoutStyles } from '../../../theme/layout';
import { useItemDetailsStyles } from './styles';
import { RootState, AppDispatch } from '../../../store/reducers';
import { closeModal } from '../../../store/reducers/modal';
import AppContentContainer from '../../../layout/AppContentContainer';
import { MenuItemPlaceholderIcon } from '../../../layout/CustomIcons';
import { MenuItemType } from '../../../types/menu';
import { dietaryRestrictions, spicinessLevels, portionSizes, servingTemperatures, currencies } from '../../../setup/setup';
import { SpicenessIcon, TemperatureIcon, SizeIcon } from '../../../layout/CustomIcons';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ItemDetailsDialogProps {
  item: MenuItemType;
  setViewedItem: React.Dispatch<React.SetStateAction<MenuItemType | null>>;
  setIsViewingItem: React.Dispatch<React.SetStateAction<boolean>>;
}

const ItemDetailsModal: React.FC<ItemDetailsDialogProps> = ({ item, setViewedItem, setIsViewingItem }) => {
  const dispatch = useDispatch<AppDispatch>();
  const classes = useItemDetailsStyles()
  const layoutClasses = useLayoutStyles()

  const openModalName = useSelector((state: RootState) => state.modal.openModal);
  const isItemDetailsDialogOpen = openModalName === 'itemDetailsDialog';

  const { menuCurrency } = useSelector(menuSelector);

  const spicinessLevel = spicinessLevels.find(level => level.id === item.spiciness);
  const servingTemperature = servingTemperatures.find(temperature => temperature.id === item.temperature);
  const portionSize = portionSizes.find(size => size.id === item.size);

  const closeDialog = useCallback(() => {
    dispatch(closeModal())
    setTimeout(() => setIsViewingItem(false), 500);
    setViewedItem(null)
  }, [dispatch, setIsViewingItem, setViewedItem]) 

  return (
    <Dialog
      fullScreen
      open={isItemDetailsDialogOpen}
      TransitionComponent={Transition}
      onClose={closeDialog}
    >
      <AppContentContainer>
        <Box>
          {item.image && item.image.url ? (
            <Box sx={classes.imageSectionContainer}>
              <Box sx={classes.imageContainer}>
                {/* <Image
                  src={item.image.url}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                /> */}
                <img
                  src={item.image.url}
                  alt={item.name}
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Box>
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              pt={2}
              pl={2}
              pr={2}
              pb={4}
            >
              <MenuItemPlaceholderIcon
                style={{
                  fontSize: 300
                }}
              />
            </Box>
          )}
          <Box sx={classes.itemDetailsContainer}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              p={2}
              gap={1}
            >
              <Box>
                <Typography variant="h3" align="center">{item.name}</Typography>
              </Box>
              {item.newPrice && (
                <Box>
                  <Typography variant="h3" align="right" sx={classes.newPrice}>
                    {menuCurrency && menuCurrency !== '' ? currencies.find(currency => currency.code === menuCurrency)?.symbol : '$'}
                    {item.newPrice}
                  </Typography>
                  {item.oldPrice && (
                    <Typography variant="body1" align="right" sx={classes.oldPrice}>
                      {menuCurrency && menuCurrency !== '' ? currencies.find(currency => currency.code === menuCurrency)?.symbol : '$'}
                      {item.oldPrice}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>

            {item.description && (
              <Box p={2} sx={classes.itemDescription}>
                <Typography variant="body1" align="left">
                  {item.description}
                </Typography>
              </Box>
            )}

            {item.ingredients && (
              <Box p={2}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  flexWrap="wrap"
                  sx={classes.ingredientsContainer}
                >
                  {[...item.ingredients].map(ingredient => (
                    <Chip key={ingredient} label={ingredient} sx={classes.ingredientChip} />
                  ))}
                </Box>
              </Box>
            )}

            <Box
              display="flex"
              alignItems="stretch"
              justifyContent="center"
              gap={2}
              mt={2}
            >
              {spicinessLevel && spicinessLevel.name !== '' && spicinessLevel.name !== 'none' && (
                <Box
                  sx={classes.itemTip}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  flexDirection="column"
                >
                  <Box
                    sx={classes.itemTipIconContainer}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <SpicenessIcon />
                  </Box>
                  <Box mt={2} p={1}>
                    <Typography variant="body1" align="center">
                      {spicinessLevel.name}
                    </Typography>
                  </Box>
                </Box>
              )}

              {item.temperature && item.temperature !== '' && servingTemperature && (
                <Box
                  sx={classes.itemTip}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  flexDirection="column"
                >
                  <Box
                    sx={classes.itemTipIconContainer}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <TemperatureIcon />
                  </Box>
                  <Box mt={2} p={1}>
                    <Typography variant="body1" align="center">
                      {servingTemperature.name}
                    </Typography>
                  </Box>
                </Box>
              )}

              {item.size && item.size !== '' && portionSize && (
                <Box
                  sx={classes.itemTip}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  flexDirection="column"
                >
                  <Box
                    sx={classes.itemTipIconContainer}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <SizeIcon />
                  </Box>
                  <Box mt={2} p={1}>
                    <Typography variant="body1" align="center">
                      {portionSize.name}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            {item.dietaryRestrictions && item.dietaryRestrictions.length > 0 && (
              <Box p={2} mt={2}>
                <Typography variant="body1" align="left">
                  {item.dietaryRestrictions.map(restrictionId => {
                    const restriction = dietaryRestrictions.find(r => r.id === restrictionId);
                    return restriction ? restriction.name : '';
                  }).filter(name => name !== '').join(' - ')}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </AppContentContainer>
      <Box sx={layoutClasses.stickyModalCloseButton}>
        <IconButton
          aria-label="delete"
          color="primary"
          sx={layoutClasses.drawerCloseButtonRight}
          disabled={false}
          onClick={closeDialog}
        >
          <ArrowBackIosIcon />
        </IconButton>
      </Box>
    </Dialog>
  );
}

export default ItemDetailsModal;
