
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { RootState } from '../store/reducers';
import { useLayoutStyles } from '../theme/layout';
import { authSelector } from '../store/selectors/auth';

type AddSectionButtonProps = {
  linkTo: string;
  text: string;
  mb?: number;
}

const AddSectionButton: React.FC<AddSectionButtonProps> = ({ linkTo, text, mb }) => {
  const router = useRouter();
  const appMode = useSelector((state: RootState) => state.mode.mode);
  const { isLoggedIn } = useSelector(authSelector)
  const layoutClasses = useLayoutStyles()

  if (isLoggedIn && appMode === 'edit') {
    return (
      <Box p={1} mb={mb || 0}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push(linkTo)}
          sx={layoutClasses.editButton}
          fullWidth
        >
          {text}
        </Button>
      </Box>
    );
  }
  return null
};

export default AddSectionButton;