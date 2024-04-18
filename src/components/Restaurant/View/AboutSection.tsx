import { useState } from 'react';
import { useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { RestaurantDataType } from '../../../types/restaurant';
import About from './About'
import CustomLinks from './CustomLinks';
import Video from './Video';
import EditableSection from '../../../layout/EditableSection';
import AddSectionButton from '../../../layout/AddSectionButton';
import { restaurantSelector } from '../../../store/selectors/restaurant';
import { authSelector } from '../../../store/selectors/auth';

import { useAboutSectionStyles } from './styles';
import { useLayoutStyles } from '@/theme/layout';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

type AboutSectionProps = {
  restaurant: RestaurantDataType;
}

const AboutSection: React.FC<AboutSectionProps> = ({ restaurant }) => {
  const classes = useAboutSectionStyles()
  const layoutClasses = useLayoutStyles()
  const { restaurantLinks, workingDays, restaurantVideo, loadingRestaurant } = useSelector(restaurantSelector);
  const { isLoggedIn } = useSelector(authSelector)
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const activeWorkingDays = workingDays ? workingDays.filter(day => 
    day.active && day.workingHours.some(shift => shift.from && shift.to)
  ) : null

  return (
    <Box width="100%">
      <Box>
        <Tabs centered value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="About" {...a11yProps(0)} />
          {((!isLoggedIn && activeWorkingDays) || isLoggedIn) && (
            <Tab label="Working Hours" {...a11yProps(1)} />
          )}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Box sx={layoutClasses.panel}>
          {restaurant.aboutData && restaurant.aboutData.about && (
            <Box mt={2} mb={2} width="100%">
              <About restaurant={restaurant} />
            </Box>
          )}
          {(!restaurant.aboutData || !restaurant.aboutData.about || restaurant.aboutData.about === '') && (
            <AddSectionButton linkTo='/about' text='Add about info' />
          )}
          <Box>
            {loadingRestaurant && !restaurantLinks && (
              <Box mt={2} mb={2} width="100%" display="flex" alignItems="center" justifyContent="center">
                <CircularProgress />
              </Box>
            )}

            {restaurantLinks && restaurantLinks.custom && restaurantLinks.custom.length > 0 && (
              <Box mt={2} mb={2} width="100%">
                <EditableSection linkTo="/links">
                  <CustomLinks
                    restaurant={restaurant}
                    restaurantLinks={restaurantLinks}
                  />
                </EditableSection>
              </Box>
            )}

            {(!restaurantLinks || !restaurantLinks.custom || restaurantLinks.custom.length === 0) && (
              <AddSectionButton linkTo='/links' text='Add custom links' />
            )}
          </Box>

          {restaurantVideo && (
            <Box mt={2} mb={2} width="100%">
              <EditableSection linkTo="/about">
                <Video videoUrl={restaurantVideo} />
              </EditableSection>
            </Box>
          )}

          {(!restaurantVideo || (restaurantVideo && restaurantVideo === '')) ? (
            <AddSectionButton linkTo='/about' text='Add video' />
          ) : null}
          
        </Box>
      </CustomTabPanel>
      {((!isLoggedIn && activeWorkingDays) || isLoggedIn) && (
        <CustomTabPanel value={value} index={1}>
          <Box width="100%" sx={layoutClasses.panel}>
            {activeWorkingDays ? (
              <EditableSection linkTo="/hours">
                {activeWorkingDays.map((day) => (
                  <Box
                    key={day.dayName}
                    display="flex"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    flexWrap="wrap"
                    pb={2}
                    pt={2}
                    pl={1}
                    pr={1}
                    sx={classes.workingHoursSection}
                  >
                    <Typography variant="body1"><b>{day.dayName}</b></Typography>
                    <Box>
                      {day.workingHours.map((shift, index) => (
                        <Typography key={index} variant="body1" align="right">{shift.from} - {shift.to}</Typography>
                      ))}
                    </Box>
                  </Box>
                ))}
              </EditableSection>
            ) : (
              <AddSectionButton linkTo='/hours' text='Add working hours' />
            )}
          </Box>
        </CustomTabPanel>
      )}
    </Box>
  );
}

export default AboutSection