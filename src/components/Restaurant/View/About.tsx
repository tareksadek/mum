import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { RootState } from '../../../store/reducers';
import { RestaurantDataType } from '../../../types/restaurant';
import EditableSection from '../../../layout/EditableSection';

type AboutProps = {
  restaurant: RestaurantDataType;
}

const About: React.FC<AboutProps> = ({ restaurant }) => {
  const setup = useSelector((state: RootState) => state.setup.setup);

  let aboutData;

  if (setup && setup.aboutData && setup.aboutData.about) {
    aboutData = setup.aboutData.about;
  } else if (restaurant && restaurant.aboutData && restaurant.aboutData.about) {
    aboutData = restaurant.aboutData.about;
  }

  if (aboutData) {
    return (
      <Box>
        <EditableSection linkTo='/about'>
          <Typography variant="body1" align="center">
            {aboutData}
          </Typography>
        </EditableSection>
      </Box>
    );
  }
  return null
};

export default About;
