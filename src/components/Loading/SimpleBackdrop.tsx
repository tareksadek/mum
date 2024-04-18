import { Typography, Box, CircularProgress } from '@mui/material';
import { useSimpleStyles } from './LoadingBackdropStyles';

interface LoadingBackdropProps {
  message?: string;
}

const SimpleBackdrop: React.FC<LoadingBackdropProps> = ({
  message,
}) => {
  const classes = useSimpleStyles()

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={classes.container}
    >
      <CircularProgress sx={{ color: '#fff' }} />
      {message && (
        <Box mt={1}>
          <Typography align='center' variant='body1'>{message}</Typography>
        </Box>
      )}
    </Box>
  )
}

export default SimpleBackdrop;