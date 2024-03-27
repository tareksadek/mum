import React, { useCallback } from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { TransitionProps } from '@mui/material/transitions';
import { Box, Slide, IconButton, Typography, Dialog, Chip } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import FaceIcon from '@mui/icons-material/Face';
import { useLayoutStyles } from '../../../theme/layout';
import { useItemDetailsStyles } from './styles';
import { RootState, AppDispatch } from '../../../store/reducers';
import { closeModal } from '../../../store/reducers/modal';
import AppContentContainer from '../../../layout/AppContentContainer';
import { MenuItemType } from '../../../types/menu';
import { dietaryRestrictions, spicinessLevels, portionSizes, servingTemperatures } from '../../../setup/setup';

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

  const spicinessLevel = spicinessLevels.find(level => level.id === item.spiciness);
  const servingTemperature = servingTemperatures.find(temperature => temperature.id === item.temperature);
  const portionSize = portionSizes.find(size => size.id === item.size);

  const closeDialog = useCallback(() => {
    dispatch(closeModal())
    setTimeout(() => setIsViewingItem(false), 500);
    setViewedItem(null)
  }, [dispatch]) 

  return (
    <Dialog
      fullScreen
      open={isItemDetailsDialogOpen}
      TransitionComponent={Transition}
      onClose={closeDialog}
    >
      <AppContentContainer>
        <Box>
          {item.image && item.image.url && (
            <Box sx={classes.imageSectionContainer}>
              <Box sx={classes.imageContainer}>
                <Image
                  src={item.image.url}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                />
              </Box>

              <Box
                pl={2}
                pr={2}
                pb={4}
                sx={classes.itemNameInImageSection}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h4" align="center">{item.name}</Typography>
                {item.newPrice && (
                  <Box display="flex" flexDirection="column">
                    {item.oldPrice && item.oldPrice !== '' && (
                      <Typography variant="body1" align="center" sx={{ textDecoration: 'line-through' }}>{item.oldPrice}</Typography>
                    )}
                    <Typography variant="h1" align="center">{item.newPrice}</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
          {(!item.image || !item.image.url) && (
            <Box p={2}>
              <Typography variant="h4" align="center">{item.name}</Typography>
            </Box>
          )}

          {item.description && (
            <Box p={2}>
              <Typography variant="body1" align="left">
                <b>Description</b>
              </Typography>
              <Typography variant="body1" align="left">
                {item.description}
              </Typography>
            </Box>
          )}

          {item.ingredients && (
            <Box p={2}>
              <Typography variant="body1" align="left">
                <b>Ingredients</b>
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                flexWrap="wrap"
                sx={classes.ingredientsContainer}
              >
                {[...item.ingredients].map(ingredient => (
                  <Typography variant="body1" align="left" key={ingredient}>
                    - {ingredient}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}

          {item.dietaryRestrictions && (
            <Box p={2}>
              <Typography variant="body1" align="left">
                <b>Dietary</b>
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                flexWrap="wrap"
                sx={classes.ingredientsContainer}
              >
                {[...item.dietaryRestrictions].map(restrictionId => {
                  const restriction = dietaryRestrictions.find(r => r.id === restrictionId);
                  return restriction ? (
                    <Chip
                      key={restriction.id}
                      icon={<FaceIcon />}
                      label={restriction.name}
                      variant="outlined"
                    />
                  ) : null;
                })}
              </Box>
            </Box>
          )}

          {item.spiciness && item.spiciness !== '' && (
            <Box p={2}>
              <Typography variant="body1" align="left">
                <b>Spiciness</b>
              </Typography>
              {spicinessLevel && (
                <Typography variant="body1" align="left">
                  {spicinessLevel.name}
                </Typography>
              )}
            </Box>
          )}

          {item.temperature && item.temperature !== '' && (
            <Box p={2}>
              <Typography variant="body1" align="left">
                <b>Serving Temperature</b>
              </Typography>
              {servingTemperature && (
                <Typography variant="body1" align="left">
                  {servingTemperature.name}
                </Typography>
              )}
            </Box>
          )}

          {item.size && item.size !== '' && (
            <Box p={2}>
              <Typography variant="body1" align="left">
                <b>Portion Size</b>
              </Typography>
              {portionSize && (
                <Typography variant="body1" align="left">
                  {portionSize.name}
                </Typography>
              )}
            </Box>
          )}
          
        </Box>
      </AppContentContainer>
      <IconButton
        aria-label="delete"
        color="primary"
        sx={layoutClasses.drawerCloseButtonRight}
        disabled={false}
        onClick={closeDialog}
      >
        <ArrowBackIosIcon />
      </IconButton>
    </Dialog>
  );
}

export default ItemDetailsModal;
