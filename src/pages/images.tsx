import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from 'react';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Box, Button } from '@mui/material';
import { profileImageDimensions, coverImageDimensions } from '../setup/setup';
import { ImageType } from '../types/restaurant';
import { RootState, AppDispatch } from '../store/reducers';
import { useRegisterSubmit, SubmitContext } from '../contexts/SubmitContext';
import { updateCoverImage, updateProfileImage } from '../store/reducers/restaurant';
import { useLayoutStyles } from '../theme/layout';
import { authSelector } from '../store/selectors/auth';
import { restaurantSelector } from '../store/selectors/restaurant';
import AppLayout from '../layout/AppLayout';
import ProfileImageProcessor from '../components/Restaurant/ProfileImageProcessor';
import CoverImageProcessor from '../components/Restaurant/CoverImageProcessor';

const Images: React.FC = () => {
  const layoutClasses = useLayoutStyles()
  const { userId, currentUser } = useSelector(authSelector);
  const { restaurant } = useSelector(restaurantSelector);
  const isLoading = useSelector((state: RootState) => state.loadingCenter.loadingCounter > 0);
  const registerSubmit = useRegisterSubmit();
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const { setFormChanged, setFormValid, formValid, formChanged } = context;
  const dispatch = useDispatch<AppDispatch>();

  const [coverImageData, setCoverImageData] = useState<ImageType>({
    url: null,
    blob: null,
    base64: null
  });
  const [profileImageData, setProfileImageData] = useState<ImageType>({
    url: null,
    blob: null,
    base64: null
  });

  const initialCoverImageData = useRef<ImageType>(coverImageData);
  const initialProfileImageData = useRef<ImageType>(profileImageData);

  const checkIfImagesChanged = useCallback(() => {
    const coverImageChanged = !_.isEqual(initialCoverImageData.current, coverImageData);
    const profileImageChanged = !_.isEqual(initialProfileImageData.current, profileImageData);
    return { coverImageChanged, profileImageChanged }
  }, [coverImageData, profileImageData]);

  const handleImagesSubmit = useCallback(() => {
    if (!userId || !currentUser) {
      return;
    }
    const imagesChanged = checkIfImagesChanged();    

    if (imagesChanged.coverImageChanged) {
      const updatedCoverImage = {
        url: coverImageData.url || null,
        base64: coverImageData.base64 || '',
        blob: coverImageData.blob || new Blob(),
      };
      dispatch(updateCoverImage({userId, restaurantId: currentUser.activeRestaurantId, coverImageData: updatedCoverImage}))
    }

    if (imagesChanged.profileImageChanged) {
      const updatedProfileImage = {
        url: profileImageData.url || null,
        base64: profileImageData.base64 || '',
        blob: profileImageData.blob || new Blob(),
      };
      dispatch(updateProfileImage({userId, restaurantId: currentUser.activeRestaurantId, profileImageData: updatedProfileImage}))
    }
  }, [userId, currentUser, coverImageData, profileImageData, checkIfImagesChanged, dispatch]);

  useEffect(() => {
    if (restaurant && restaurant.coverImageData) {
      setCoverImageData(restaurant.coverImageData)
      initialCoverImageData.current = restaurant.coverImageData;
    }
    if (restaurant && restaurant.profileImageData) {
      setProfileImageData(restaurant.profileImageData)
      initialProfileImageData.current = restaurant.profileImageData;
    }
  }, [restaurant]);

  useEffect(() => {
    registerSubmit(handleImagesSubmit);
  }, [registerSubmit, handleImagesSubmit]);

  useEffect(() => {
    const imagesChanged = checkIfImagesChanged();
    setFormValid(true)

    setFormChanged(imagesChanged.coverImageChanged || imagesChanged.profileImageChanged);
  }, [checkIfImagesChanged, setFormChanged, setFormValid]);

  return (
    <AppLayout>
      <Box p={2}>
        <Box pb={2}>
          <Typography variant="h4" align="center">Restaurant Logo</Typography>
          <ProfileImageProcessor
            isLoading={isLoading}
            data={profileImageData}
            setData={setProfileImageData}
            cropWidth={profileImageDimensions.width}
            cropHeight={profileImageDimensions.height}
            createBase64={true}
          />
        </Box>

        {/* {currentUser && !currentUser.isTeamMember && appSetup && appSetup.coverImageData && !appSetup.coverImageData.url && !user?.isTeamMaster && ( */}
          <Box mt={2} mb={2}>
            <Typography variant="h4" align="center">Cover Photo</Typography>
            <CoverImageProcessor
              isLoading={isLoading}
              data={coverImageData}
              setData={setCoverImageData}
              cropWidth={coverImageDimensions.width}
              cropHeight={coverImageDimensions.height}
              createBase64={false}
            />
          </Box>
        {/* )} */}

        <Box
          sx={layoutClasses.stickyBottomBox}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            // type="submit"
            onClick={handleImagesSubmit}
            fullWidth
            variant="contained"
            color="primary"
            disabled={!formValid || !formChanged}
          >
            Save
          </Button>
        </Box>
      </Box>
    </AppLayout>
  );
}

export default Images;