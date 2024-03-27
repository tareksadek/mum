import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { TransitionProps } from '@mui/material/transitions';
import { Box, Slide, IconButton, Typography, Dialog } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useRegisterSubmit, SubmitContext } from '../../../contexts/SubmitContext';
import { useLayoutStyles } from '../../../theme/layout';
import { useMenuCreatorStyles } from './styles';
import { RootState, AppDispatch } from '../../../store/reducers';
import { authSelector } from '../../../store/selectors/auth';
import { restaurantSelector } from '../../../store/selectors/restaurant';
import { menuSelector } from '../../../store/selectors/menu';
import { closeModal } from '../../../store/reducers/modal';
import { createRestaurantMenuItem, editRestaurantMenuItem } from '../../../store/reducers/menu';
import AppContentContainer from '../../../layout/AppContentContainer';
import { MenuItemType, MenuSectionType } from '../../../types/menu';
import { ImageType } from '../../../types/restaurant';
import MenuItemInfoForm from './MenuItemInfoForm';
import SaveButton from '../../../layout/SaveButton';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface MenuItemDialogProps {
  item: MenuItemType | null;
  section: MenuSectionType | null;
  setIsEditingItem: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultNewItemValues = {
  visible: true,
  description: "",
  name: "",
  newPrice: "",
  oldPrice: "",
  dietaryRestrictions: [],
  types: [],
  ingredients: [],
  spiciness: "",
  temperature: "",
  size: ""
};

const MenuItemDialog: React.FC<MenuItemDialogProps> = ({ section, item, setIsEditingItem }) => {
  const dispatch = useDispatch<AppDispatch>();
  const layoutClasses = useLayoutStyles()
  const classes = useMenuCreatorStyles()
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState,
    trigger,
  } = useForm<MenuItemType>({ mode: 'onChange' });
  const watchedValues = watch();
  const registerSubmit = useRegisterSubmit();
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const { setFormChanged, setFormValid, formValid, formChanged } = context;
  const { errors, isValid } = formState;
  const [itemImageData, setItemImageData] = useState<ImageType>({
    url: null,
    blob: null,
    base64: null
  });
  const openModalName = useSelector((state: RootState) => state.modal.openModal);
  const isItemDialogOpen = openModalName === 'itemDialog' || openModalName === 'profileImage';

  const initialItemImageData = useRef<ImageType>(itemImageData);

  const { userId } = useSelector(authSelector);
  const { restaurantId } = useSelector(restaurantSelector);
  const { menu, menuId, editingMenu, creatingMenu } = useSelector(menuSelector);

  const checkIfItemImageChanged = useCallback(() => {
    const itemImageChanged = !_.isEqual(initialItemImageData.current, itemImageData);
    return itemImageChanged
  }, [itemImageData]);

  const resetDialog = useCallback(() => {
    setFormValid(true)
    setFormChanged(false)
    setItemImageData({
      url: null,
      blob: null,
      base64: null
    })
    reset(defaultNewItemValues);
  }, [setFormValid, setFormChanged, reset])

  const closeDialog = useCallback(() => {
    dispatch(closeModal())
    setTimeout(() => setIsEditingItem(false), 500);
    resetDialog()
  }, [dispatch, resetDialog, setIsEditingItem])

  console.log(watchedValues)
  console.log(defaultNewItemValues)
  
  useEffect(() => {
    if (item) {
      setItemImageData(prev => ({
        ...prev,
        url: item.image ? item.image.url : null
      }))
      initialItemImageData.current = {
        ...initialItemImageData.current,
        url: item.image ? item.image.url : null
      };
    }
  }, [item, isItemDialogOpen]);
  
  const handleItemSubmit = useCallback(async (data: MenuItemType) => {
    const itemData = {
      ...data,
      ...(item && item.id ? {} : { sortOrder: menu && section && section.items ? section.items.length : 0 }),
      image: itemImageData,
    };

    console.log(itemData)
    console.log(section)
  
    if (userId && restaurantId && menuId && section && section.id) {
      try {
        if (item && item.id) {
          // Edit item scenario
          await dispatch(editRestaurantMenuItem({ userId, restaurantId, menuId, sectionId: section.id, itemId: item.id, itemData })).unwrap();
        } else {
          // Create item scenario
          await dispatch(createRestaurantMenuItem({ userId, restaurantId, menuId, sectionId: section.id, itemData })).unwrap();
        }
        // The .unwrap() method is used to return the original Promise from the async thunk allowing us to await its resolution
      } catch (error) {
        console.error("Error handling item submit:", error);
      } finally {
        if (!editingMenu && !creatingMenu) {
          closeDialog()
        }
      }
    }
  }, [dispatch, menu, menuId, restaurantId, userId, section, item, itemImageData, editingMenu, creatingMenu, closeDialog]);  

  useEffect(() => {
    registerSubmit(() => handleSubmit(handleItemSubmit)());
  }, [registerSubmit, handleSubmit, handleItemSubmit]);

  useEffect(() => {   
    let formChanged = false
    const imageChanged = checkIfItemImageChanged();

    if (item && item.id) {
      const cleanItemData = _.omit(item, ['sortOrder', 'image', 'id']);
      formChanged = !_.isEqual(cleanItemData, watchedValues);
      setFormChanged(formChanged || imageChanged);
    } else {
      formChanged = !_.isEqual(defaultNewItemValues, watchedValues);
      setFormChanged(formChanged || imageChanged);
    }
  }, [watchedValues, setFormChanged, item, checkIfItemImageChanged]);

  useEffect(() => {
    if (section && item) {
      setValue('visible', item.visible);
      setValue('name', item.name || '');
      setValue('newPrice', item.newPrice || '');
      setValue('oldPrice', item.oldPrice || '');
      setValue('ingredients', item.ingredients || []);
      setValue('description', item.description || '');
      setValue('dietaryRestrictions', item.dietaryRestrictions || []);
      setValue('types', item.types || []);
      setValue('spiciness', item.spiciness || '');
      setValue('temperature', item.temperature || '');
      setValue('size', item.size || '');
    } else {
      setValue('dietaryRestrictions', []);
      setValue('types', []);
      setValue('spiciness', '');
      setValue('temperature', '');
      setValue('size', '');
    }
  }, [item, section, setValue]);

  useEffect(() => {
    setFormValid(isValid);
  }, [isValid, setFormValid]);

  return (
    <Dialog
      fullScreen
      open={isItemDialogOpen}
      TransitionComponent={Transition}
      onClose={closeDialog}
    >
      <AppContentContainer>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4" align="center">{item && item.id ? `Edit ${item.name}` : `Add Item to: ${section ? section.name : ''}`}</Typography>
          </Box>
          <form onSubmit={handleSubmit(handleItemSubmit)}>
            <MenuItemInfoForm
              itemImageData={itemImageData}
              setItemImageData={setItemImageData}
              item={item}
              control={control}
              register={register}
              errors={errors}
              setValue={setValue}
              disableFields={editingMenu || creatingMenu}
              trigger={trigger}
            />
            <Box
              sx={layoutClasses.stickyBottomBox}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <SaveButton
                type="submit"
                text={item ? 'Edit Item' : 'Add item'}
                disabled={!formValid || editingMenu || creatingMenu || !!(item && item.id && !formChanged)}
                processing={editingMenu || creatingMenu}
              />
            </Box>
          </form>
        </Box>
      </AppContentContainer>
      <IconButton
        aria-label="delete"
        color="primary"
        sx={layoutClasses.drawerCloseButtonRight}
        disabled={editingMenu || creatingMenu}
        onClick={closeDialog}
      >
        <ArrowBackIosIcon />
      </IconButton>
    </Dialog>
  );
}

export default MenuItemDialog;
