import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, CircularProgress, IconButton, Typography, Drawer, TextField, Alert, Chip, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ViewListIcon from '@mui/icons-material/ViewList';
import { MenuType } from '../../../types/menu';
import { useLayoutStyles } from '../../../theme/layout';
import { useMenuCreatorStyles } from './styles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { EditIcon } from '../../../layout/CustomIcons';
import { RootState, AppDispatch } from '../../../store/reducers';
import { openModal, closeModal } from '../../../store/reducers/modal';
import { createRestaurantMenu, editRestaurantMenu } from '../../../store/reducers/menu';
import { authSelector } from '../../../store/selectors/auth';
import { restaurantSelector } from '../../../store/selectors/restaurant';
import { menuSelector } from '../../../store/selectors/menu';
import { currencies } from '../../../setup/setup';

interface LinksCreatorProps {
  menus: MenuType[] | null;
  loading: boolean;
}

const MenuCreator: React.FC<LinksCreatorProps> = ({ menus, loading }) => {
  const dispatch = useDispatch<AppDispatch>();
  const classes = useMenuCreatorStyles()
  const layoutClasses = useLayoutStyles()
  const {
    control,
    handleSubmit,
    reset,
    formState,
    setValue,
  } = useForm<MenuType>({ mode: 'onChange' });
  const { errors } = formState;
  const { userId } = useSelector(authSelector);
  const { restaurant, restaurantId } = useSelector(restaurantSelector);
  const { menu, menuId } = useSelector(menuSelector);
  const openModalName = useSelector((state: RootState) => state.modal.openModal);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const isFirstMenu = !menus || (menus && menus.length === 0)
  const isCreateMenuModalOpen = openModalName === 'createMenu';
  const router = useRouter();

  const onSubmit = (data: MenuType) => {
    const menuData = {
      name: data.name,
      currency: data.currency,
      isActive: isFirstMenu || false
    }
    if (restaurant && restaurantId && userId) {
      if (isEditing && menuId) {
        dispatch(editRestaurantMenu({ userId, restaurantId, menuId, menuData }))
      } else {
        dispatch(createRestaurantMenu({ userId, restaurantId, menuData }))
      }
    }
    dispatch(closeModal())
    setIsEditing(false)
    reset({
      isActive: isFirstMenu || false,
      currency: "",
      name: "",
    });
  };  

  const handleCreateMenu = () => {
    dispatch(openModal('createMenu'));
  };

  const handleMenuDetails = (menuId: string | undefined) => {
    if (menuId) {
      router.push(`/menus/${menuId}`)
    } 
  };

  const handleEditMenu = (e: React.SyntheticEvent, menuId: string | undefined) => {
    e.stopPropagation()
    setIsEditing(true)
    setValue('currency', menu?.currency)
    setValue('name', menu?.name)
    dispatch(openModal('createMenu'));
  };

  // const handleDeleteMenu = (index: number, isSocialLink: boolean) => {
  
  // };

  return (
    <Box>
      <Box>
        <Box mt={4}>
          <Box mb={2}>
            <Typography variant="h4" align="center">Current Menus</Typography>
          </Box>
          <>
            {loading ? (
              <Box display="flex" alignItems="center" justifyContent="center">
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                {menus && menus.length > 0 && menus.map((menu, index) => (
                  <Box
                    sx={classes.menuListItem}
                    key={menu.id}
                  >
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      flexWrap="wrap"
                      onClick={() => handleMenuDetails(menu.id)}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                        >
                          <Box ml={1}>
                            <Typography variant="body1" align="left">
                              <b>
                                {menu.name}
                              </b>
                            </Typography>
                            {/* {menu.isActive && (
                              <Chip label="Active" size="small" sx={classes.activeChip} />
                            )} */}
                          </Box>
                        </Box>
                      </Box>
                      <Box>
                        <IconButton
                          onClick={() => handleMenuDetails(menu.id)}
                          sx={classes.menuIconButton}
                        >
                          <ViewListIcon />
                        </IconButton>
                        <IconButton
                          onClick={(e) => handleEditMenu(e, menu.id)}
                          sx={classes.menuIconButton}
                        >
                          <EditIcon />
                        </IconButton>
                        {/* <IconButton
                          onClick={() => handleDeleteMenu(index, false)}
                          sx={classes.menuIconButton}
                        >
                          <DeleteOutlineIcon />
                        </IconButton> */}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </>  

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            mt={2}
          >
            {(!menus || menus.length === 0) && !loading && (
              <Box
                onClick={() => handleCreateMenu()}
                mb={1}
              >
                <Alert severity="warning">
                  There are no menus created yet for this restaurant. Start creating your first menu.
                </Alert>
              </Box>
            )}
            <Box width="100%">
              <Button
                onClick={() => handleCreateMenu()}
                variant="outlined"
                color="secondary"
                fullWidth
              >
                Create Menu
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Drawer
        anchor="bottom"
        open={isCreateMenuModalOpen}
        sx={layoutClasses.radiusBottomDrawer}
        onClose={() => {
          dispatch(closeModal())
          reset({
            isActive: isFirstMenu || false,
            name: "",
          });
        }}
      >
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4" align="center">Create Menu</Typography>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            {isCreateMenuModalOpen && (
              <>
                <Box mb={2}>
                  <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Title is required",
                      validate: value => (value && value.length <= 39) || "Title must be 40 characters or less"
                    }}
                    render={({ field: { ref, ...inputProps } }) => (
                      <TextField
                        label="Menu Title*: i.e Our Menu, Appetizers, Drinks..."
                        inputRef={ref}
                        {...inputProps}
                        inputProps={{
                          maxLength: 40
                        }}
                        error={Boolean(errors.name)}
                        helperText={errors.name?.message}
                        fullWidth
                      />
                    )}
                  />
                </Box>
                <Box mb={1}>
                  <Controller
                    name="currency"
                    control={control}
                    defaultValue="USD"
                    rules={{ required: "Currency selection is required" }}
                    render={({ field }) => (
                      <TextField {...field} select label="Currency" fullWidth variant="outlined">
                        {currencies.map((currency) => (
                          <MenuItem key={currency.code} value={currency.code}>
                            {`${currency.symbol} - ${currency.name}`}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Box>
              </>
            )}

            <Box mt={2}>
              <Button
                type="submit"
                disabled={!formState.isValid}
                variant="contained"
                color="primary"
                fullWidth
              >
                {isEditing ? 'Save' : 'Create'}
              </Button>
            </Box>
          </form>
        </Box>
        <IconButton
          aria-label="delete"
          color="primary"
          sx={layoutClasses.drawerCloseButton}
          onClick={() => {
            dispatch(closeModal())
            reset({
              isActive: isFirstMenu || false,
              name: "",
            });
          }}
        >
          <CloseIcon />
        </IconButton>
      </Drawer>
    </Box>
  );
}

export default MenuCreator;
