import React, { useState, useCallback } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import { formatISO } from 'date-fns';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { Timestamp } from '@firebase/firestore';
import {
  appDefaultTheme,
  appDefaultColor,
  appDefaultLayout,
  appDefaultSocialLinksToSelectedColor,
} from '../setup/setup';
import {
  BasicInfoFormDataTypes,
  AboutFormDataTypes,
  LinkType,
  ThemeSettingsType,
  ColorType,
  ImageType,
} from '../types/restaurant';
import { RootState, AppDispatch } from '../store/reducers';
import { saveRestaurant } from '../store/reducers/restaurant';
import { replaceEmptyOrUndefinedWithNull } from '../utilities/utils';
import { Box, Typography, Stepper, Step, StepLabel } from '@mui/material';
import AppLayout from '@/layout/AppLayout';
import StepOne from '../components/Restaurant/create/StepOne';
import StepTwo from '../components/Restaurant/create/StepTwo';
import StepThree from '../components/Restaurant/create/StepThree';
import StepFour from '../components/Restaurant/create/StepFour';
import StepFive from '../components/Restaurant/create/StepFive';

const CreateRestaurant: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [activeStep, setActiveStep] = useState(0);
  const [basicInfoData, setBasicInfoData] = useState<BasicInfoFormDataTypes | null>(null);
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [aboutData, setAboutData] = useState<AboutFormDataTypes | null>(null);
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
  const [links, setLinks] = useState<{ social: LinkType[], custom: LinkType[] }>({ social: [], custom: [] });
  const [themeSettings, setThemeSettings] = useState<ThemeSettingsType>({
    selectedColor: appDefaultColor,
    theme: appDefaultTheme,
    layout: appDefaultLayout,
    socialLinksToSelectedColor: appDefaultSocialLinksToSelectedColor
  });
  const [favoriteColors, setFavoriteColors] = useState<ColorType[]>([]);

  const currentUser = useSelector((state: RootState) => state.user.user);
  const authUser = useSelector((state: RootState) => state.authUser);
  const isLoading = useSelector((state: RootState) => state.loadingCenter.loadingCounter > 0);

  const getSteps = () => {
    let steps = [];

    steps.push('info');

    steps.push('about');

    steps.push('images');

    steps.push('links');

    steps.push('theme');

    return steps;
  };

  const steps = getSteps();

  const isFirstStep = useCallback(() => {
    return activeStep === 0;
  }, [activeStep]);

  const isLastStep = useCallback(() => {
    return activeStep === steps.length - 1;
  }, [activeStep, steps]);

  const handleNext = useCallback(async () => {
    if (isLastStep()) {
      if (basicInfoData) {
        basicInfoData.location = location
      }

      let restaurantData = {
        title: 'default',
        basicInfoData: basicInfoData,
        aboutData: aboutData,
        coverImageData: coverImageData,
        profileImageData: profileImageData,
        contactFormData: {
          formProvider: 'default',
          embedCode: null,
        },
        links,
        themeSettings,
        favoriteColors,
        createdOn: formatISO(Timestamp.now().toDate()),
      };

      restaurantData = replaceEmptyOrUndefinedWithNull(restaurantData);
      
      if (authUser.userId) {
        try {
          const actionResult = await dispatch(saveRestaurant({ userId: authUser.userId, restaurantData }));
          unwrapResult(actionResult);
          if (currentUser) {
            router.push(`/${currentUser?.profileUrlSuffix}`);
          }
        } catch (error) {
          console.error('Failed to save restaurant:', error);
        }
      }

    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  }, [
    basicInfoData,
    aboutData,
    coverImageData,
    profileImageData,
    links,
    themeSettings,
    favoriteColors,
    authUser,
    dispatch,
    isLastStep,
    location,
    router,
    currentUser,
  ]);

  const handlePrev = useCallback(() => {
    setActiveStep((prevStep) => prevStep - 1);
  }, []);

  const handleBasicInfoSubmit = (formData: Partial<BasicInfoFormDataTypes>) => {
    setBasicInfoData(formData)
    handleNext()
  };

  const handleAboutSubmit = (formData: Partial<AboutFormDataTypes>) => {
    setAboutData(formData)
    handleNext()
  };

  const stepComponents: { [key: string]: JSX.Element } = {
    'info': <StepOne
      formStatedata={basicInfoData}
      location={location}
      setLocation={setLocation}
      onPrev={handlePrev}
      onSubmit={handleBasicInfoSubmit}
      currentUser={currentUser}
      loadingUser={isLoading}
      isFirstStep={isFirstStep()}
    />,
    'about': <StepTwo
      formStatedata={aboutData}
      onSubmit={handleAboutSubmit}
      onPrev={handlePrev}
      currentUser={currentUser}
      isLastStep={isLastStep()}
    />,
    'images': <StepThree
      onNext={handleNext}
      onPrev={handlePrev}
      coverImageData={coverImageData}
      setCoverImageData={setCoverImageData}
      initialCoverImage={null}
      profileImageData={profileImageData}
      setProfileImageData={setProfileImageData}
      initialProfileImage={null}
      currentUser={currentUser}
      isLastStep={isLastStep()}
    />,
    'links': <StepFour
      onNext={handleNext}
      onPrev={handlePrev}
      links={links}
      setLinks={setLinks}
      isLastStep={isLastStep()}
    />,
    'theme': <StepFive
      onNext={handleNext}
      onPrev={handlePrev}
      data={themeSettings}
      setData={setThemeSettings}
      favoriteColors={favoriteColors}
      setFavoriteColors={setFavoriteColors}
      isLastStep={isLastStep()}
    />
  };

  if (!isLoading) {
    return (
      <AppLayout>
        <Box>
          <Box pt={2} pb={2}>
            <Typography variant="h3" align="center">Create Your Restaurant</Typography>
            <Box mt={2} mb={3}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {getSteps().map((label) => (

                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>

                ))}
              </Stepper>
            </Box>
            <Box width="100%" pl={2} pr={2}>
              {stepComponents[getSteps()[activeStep]]}
            </Box>
          </Box>
        </Box>
      </AppLayout>
    );
  } else {
    return null;
  }
}

export default CreateRestaurant;
