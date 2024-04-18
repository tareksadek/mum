
import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { RootState } from '../store/reducers';
import { useLayoutStyles } from '../theme/layout';
import { authSelector } from '../store/selectors/auth';

type EditLogoSectionProps = {
  linkTo: string;
}

const EditLogoSection: React.FC<EditLogoSectionProps> = ({ linkTo }) => {
  const router = useRouter();
  const appMode = useSelector((state: RootState) => state.mode.mode);
  const { isLoggedIn } = useSelector(authSelector)
  const layoutClasses = useLayoutStyles()

  if (isLoggedIn && appMode === 'edit') {
    return (
      <Box sx={layoutClasses.editLogoSection} onClick={() => router.push(linkTo)}>
        <Box sx={layoutClasses.editLogoSectionIcon}>
          <PhotoCameraIcon />
        </Box>
      </Box>
    );
  } else {
    return <></>
  }
};

export default EditLogoSection;