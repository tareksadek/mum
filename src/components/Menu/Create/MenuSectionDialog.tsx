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
import { createRestaurantMenuSection, editRestaurantSection } from '../../../store/reducers/menu';
import AppContentContainer from '../../../layout/AppContentContainer';
import { MenuSectionType } from '../../../types/menu';
import { ImageType } from '../../../types/restaurant';
import MenuSectionInfoForm from './MenuSectionInfoForm';
import SaveButton from '../../../layout/SaveButton';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface MenuSectionDialogProps {
  section: MenuSectionType | null;
  setIsEditingSection: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultNewSectionValues = {
  visible: true,
  description: "",
  name: "",
}

const MenuSectionDialog: React.FC<MenuSectionDialogProps> = ({ section, setIsEditingSection }) => {
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
  } = useForm<MenuSectionType>({ mode: 'onChange' });
  const watchedValues = watch();
  const registerSubmit = useRegisterSubmit();
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const { setFormChanged, setFormValid, formValid, formChanged } = context;
  const { errors, isValid } = formState;
  const [sectionImageData, setSectionImageData] = useState<ImageType>({
    url: null,
    blob: null,
    base64: null
  });
  const openModalName = useSelector((state: RootState) => state.modal.openModal);
  const isSectionDialogOpen = openModalName === 'sectionDialog' || openModalName === 'coverImage';

  const initialSectionImageData = useRef<ImageType>(sectionImageData);

  const { userId } = useSelector(authSelector);
  const { restaurantId } = useSelector(restaurantSelector);
  const { menu, menuId, editingMenu } = useSelector(menuSelector);

  const checkIfSectionImageChanged = useCallback(() => {
    const sectionImageChanged = !_.isEqual(initialSectionImageData.current, sectionImageData);
    return sectionImageChanged
  }, [sectionImageData]);

  const resetDialog = useCallback(() => {
    setFormValid(true)
    setFormChanged(false)
    setSectionImageData({
      url: null,
      blob: null,
      base64: null
    })
    reset(defaultNewSectionValues);
  }, [setFormValid, setFormChanged, reset])

  const closeDialog = useCallback(() => {
    dispatch(closeModal())
    setTimeout(() => setIsEditingSection(false), 500);
    resetDialog()
  }, [dispatch, resetDialog, setIsEditingSection])
  
  useEffect(() => {
    if (section) {
      setSectionImageData(prev => ({
        ...prev,
        url: section.image ? section.image.url : null
      }))
      initialSectionImageData.current = {
        ...initialSectionImageData.current,
        url: section.image ? section.image.url : null
      };
    }
  }, [section, isSectionDialogOpen]);
  
  const handleSectionSubmit = useCallback(async (data: MenuSectionType) => {
    const sectionData = {
      ...data,
      ...(section && section.id ? {} : { sortOrder: menu && menu.sections ? menu.sections.length : 0 }),
      image: sectionImageData,
    };
  
    if (userId && restaurantId && menuId) {
      try {
        if (section && section.id) {
          // Edit section scenario
          await dispatch(editRestaurantSection({ userId, restaurantId, menuId, sectionId: section.id, sectionData })).unwrap();
        } else {
          // Create section scenario
          await dispatch(createRestaurantMenuSection({ userId, restaurantId, menuId, sectionData })).unwrap();
        }
        // The .unwrap() method is used to return the original Promise from the async thunk allowing us to await its resolution
      } catch (error) {
        console.error("Error handling section submit:", error);
      } finally {
        if (!editingMenu) {
          closeDialog()
        }
      }
    }
  }, [dispatch, menu, menuId, restaurantId, userId, section, sectionImageData, editingMenu, closeDialog]);  

  useEffect(() => {
    registerSubmit(() => handleSubmit(handleSectionSubmit)());
  }, [registerSubmit, handleSubmit, handleSectionSubmit]);

  useEffect(() => {
    if (section) {
      setValue('visible', section.visible);
      setValue('name', section.name || '');
      setValue('description', section.description || '');
    }
  }, [section, setValue]);

  useEffect(() => {
    setFormValid(isValid);
  }, [isValid, setFormValid]);

  useEffect(() => {
    if (section && section.id) {
      const cleanSectionData = _.omit(section, ['sortOrder', 'items', 'image', 'id']);
      const formChanged = !_.isEqual(cleanSectionData, watchedValues);
      const imageChanged = checkIfSectionImageChanged();

      console.log(cleanSectionData)
      console.log(watchedValues)

      setFormChanged(formChanged || imageChanged);
    }
  }, [watchedValues, setFormChanged, section, checkIfSectionImageChanged]);

  return (
    <Dialog
      fullScreen
      open={isSectionDialogOpen}
      TransitionComponent={Transition}
      onClose={closeDialog}
    >
      <AppContentContainer>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4" align="center">{section && section.id ? 'Edit' : 'Add'} Menu Section</Typography>
          </Box>
          <form onSubmit={handleSubmit(handleSectionSubmit)}>
            <MenuSectionInfoForm
              sectionImageData={sectionImageData}
              setSectionImageData={setSectionImageData}
              section={section}
              control={control}
              register={register}
              errors={errors}
              setValue={setValue}
              disableFields={editingMenu}
            />
            <Box
              sx={layoutClasses.stickyBottomBox}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <SaveButton
                type="submit"
                text={section ? 'Edit Section' : 'Add Section'}
                disabled={!formValid || editingMenu || !!(section && section.id && !formChanged)}
                processing={editingMenu}
              />
            </Box>
          </form>
        </Box>
      </AppContentContainer>
      <IconButton
        aria-label="delete"
        color="primary"
        sx={layoutClasses.drawerCloseButtonRight}
        disabled={editingMenu}
        onClick={closeDialog}
      >
        <ArrowBackIosIcon />
      </IconButton>
    </Dialog>
  );
}

export default MenuSectionDialog;
