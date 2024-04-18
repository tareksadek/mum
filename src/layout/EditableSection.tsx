
import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import { RootState } from '../store/reducers';
import { useLayoutStyles } from '../theme/layout';
import { authSelector } from '../store/selectors/auth';

type EditableSectionProps = {
  linkTo: string;
  children: ReactNode;
  defaultButton?: boolean;
}

const EditableSection: React.FC<EditableSectionProps> = ({ linkTo, children, defaultButton }) => {
  const router = useRouter();
  const appMode = useSelector((state: RootState) => state.mode.mode);
  const { isLoggedIn } = useSelector(authSelector)
  const layoutClasses = useLayoutStyles()

  return (
    <Box mb={isLoggedIn && appMode === 'edit' ? 3 : 0}>
      <Box
        sx={isLoggedIn && appMode === 'edit' ? layoutClasses.editContainer : {}}
        {...(isLoggedIn && appMode === 'edit' ? { onClick: () => router.push(linkTo) } : {})}
      >
        {isLoggedIn && appMode === 'edit' && (
          <Box
            sx={{
              ...layoutClasses.editContainerIcon,
              ...(defaultButton ? layoutClasses.editContainerIconDefault : {})
            }}
          >
            <EditIcon />
            Edit
          </Box>
        )}
        {children}
      </Box>
    </Box>
  );

};

export default EditableSection;