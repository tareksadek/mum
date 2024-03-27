import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { TransitionProps } from '@mui/material/transitions';
import { Box, Slide, IconButton, Typography, Dialog } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useRegisterSubmit, SubmitContext } from '../../../contexts/SubmitContext';
import { useLayoutStyles } from '../../../theme/layout';
import { RootState, AppDispatch } from '../../../store/reducers';
import { authSelector } from '../../../store/selectors/auth';
import { restaurantSelector } from '../../../store/selectors/restaurant';
import { menuSelector } from '../../../store/selectors/menu';
import { closeModal } from '../../../store/reducers/modal';
import { createRestaurantMenuItem, editRestaurantMenuItem } from '../../../store/reducers/menu';
import AppContentContainer from '../../../layout/AppContentContainer';
import { MenuSectionType, MenuFilterType, MenuItemType } from '../../../types/menu';
import { ImageType } from '../../../types/restaurant';
import MenuFilterForm from './MenuFilterForm';
import SaveButton from '../../../layout/SaveButton';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const defaultFilterValues: MenuFilterType = {
  price: '',
  dietaryRestrictions: [],
  types: [],
  spiciness: "",
  temperature: "",
  size: ""
};

interface MenuFilterDialogProps {
  maxPrice: number | null;
  setFilteredMenuSections: React.Dispatch<React.SetStateAction<MenuSectionType[] | null>>;
  setFilterValues: React.Dispatch<React.SetStateAction<MenuFilterType | null>>;
  sections: MenuSectionType[] | null;
  filterValues: MenuFilterType | null;
}

const MenuFilterDialog: React.FC<MenuFilterDialogProps> = ({ maxPrice, setFilteredMenuSections, setFilterValues, sections, filterValues }) => {
  const dispatch = useDispatch<AppDispatch>();
  const layoutClasses = useLayoutStyles()
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState,
    trigger,
  } = useForm<MenuFilterType>({ mode: 'onChange' });
  const watchedValues = watch();
  const registerSubmit = useRegisterSubmit();
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const { setFormChanged, setFormValid, formValid, formChanged } = context;
  const { errors, isValid } = formState;

  const openModalName = useSelector((state: RootState) => state.modal.openModal);
  const isFilterDialogOpen = openModalName === 'filterDialog'

  const { menu } = useSelector(menuSelector);

  const resetDialog = useCallback(() => {
    setFormValid(true)
    setFormChanged(false)
    // reset(defaultFilterValues);
  }, [setFormValid, setFormChanged, reset])

  const closeDialog = useCallback(() => {
    dispatch(closeModal())
    resetDialog()
  }, [dispatch, resetDialog])

  console.log(watchedValues)
  console.log(defaultFilterValues)
  
  const handleFilterSubmit = useCallback((filters: MenuFilterType) => {
    let filteredSections: MenuSectionType[] | null = null;
  
    console.log(filters);
  
    if (sections) {
      filteredSections = sections.reduce<MenuSectionType[]>((acc, section) => {
        let filteredItems: MenuItemType[] = section.items ? section.items.filter(item => {
          const priceMatch = filters.price ? parseFloat(item.newPrice ?? '0') <= parseFloat(filters.price) : true;
          const dietaryMatch = filters.dietaryRestrictions && filters.dietaryRestrictions.length > 0 ? filters.dietaryRestrictions.some(diet => item.dietaryRestrictions?.includes(diet)) : true;
          const typeMatch = filters.types && filters.types.length > 0 ? filters.types.some(type => item.types?.includes(type)) : true;
          const spicinessMatch = filters.spiciness ? item.spiciness === filters.spiciness : true;
          const temperatureMatch = filters.temperature ? item.temperature === filters.temperature : true;
          const sizeMatch = filters.size ? item.size === filters.size : true;
  
          return priceMatch && dietaryMatch && typeMatch && spicinessMatch && temperatureMatch && sizeMatch;
        }) : [];
  
        if (filteredItems.length > 0) {
          acc.push({ ...section, items: filteredItems });
        }
  
        return acc;
      }, []);
    }
  
    console.log(filteredSections);
    setFilterValues(filters)
    setFilteredMenuSections(filteredSections);
    closeDialog();
  }, [sections]); 

  useEffect(() => {
    registerSubmit(() => handleSubmit(handleFilterSubmit)());
  }, [registerSubmit, handleSubmit, handleFilterSubmit]);

  useEffect(() => {   
    defaultFilterValues.price = filterValues && filterValues.price && filterValues.price !=='' ? filterValues.price : String(maxPrice) || ''
    defaultFilterValues.spiciness = filterValues && filterValues.spiciness && filterValues.spiciness !=='' ? filterValues.spiciness : ''
    defaultFilterValues.temperature = filterValues && filterValues.temperature && filterValues.temperature !=='' ? filterValues.temperature : ''
    defaultFilterValues.size = filterValues && filterValues.size && filterValues.size !=='' ? filterValues.size : ''
    defaultFilterValues.dietaryRestrictions = filterValues && filterValues.dietaryRestrictions && filterValues.dietaryRestrictions.length > 0 ? filterValues.dietaryRestrictions : []
    defaultFilterValues.types = filterValues && filterValues.types && filterValues.types.length > 0 ? filterValues.types : []
    const formChanged = !_.isEqual(defaultFilterValues, watchedValues);
    setFormChanged(formChanged);
  }, [watchedValues, setFormChanged]);

  useEffect(() => {
    console.log('filter values')
    if (filterValues) {
      setValue('price', filterValues.price);
      setValue('dietaryRestrictions', filterValues.dietaryRestrictions);
      setValue('types', filterValues.types);
      setValue('spiciness', filterValues.spiciness);
      setValue('temperature', filterValues.temperature);
      setValue('size', filterValues.size);
    } else {
      setValue('price', String(maxPrice) || '');
      setValue('dietaryRestrictions', []);
      setValue('types', []);
      setValue('spiciness', '');
      setValue('temperature', '');
      setValue('size', '');
    }
      
  }, [setValue, maxPrice, filterValues]);

  useEffect(() => {
    setFormValid(isValid);
  }, [isValid, setFormValid]);

  return (
    <Dialog
      fullScreen
      open={isFilterDialogOpen}
      TransitionComponent={Transition}
      onClose={closeDialog}
    >
      <AppContentContainer>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4" align="center">Menu Filter</Typography>
          </Box>
          <form onSubmit={handleSubmit(handleFilterSubmit)}>
            <MenuFilterForm
              maxPrice={maxPrice}
              control={control}
              register={register}
              errors={errors}
              setValue={setValue}
              disableFields={false}
              selectedPrice={filterValues && filterValues.price && filterValues.price !== '' ? filterValues.price : null}
            />
            <Box
              sx={layoutClasses.stickyBottomBox}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <SaveButton
                type="submit"
                text="Filter"
                disabled={!formValid || (formValid && !formChanged)}
                processing={false}
              />
            </Box>
          </form>
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

export default MenuFilterDialog;
