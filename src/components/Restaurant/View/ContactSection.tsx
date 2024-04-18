import Box from '@mui/material/Box';
import { RestaurantDataType } from '../../../types/restaurant';
import Info from './Info'
import ActionButtons from './ActionButtons'

import { useLayoutStyles } from '@/theme/layout';

type ContactSectionProps = {
  restaurant: RestaurantDataType;
}

const ContactSection: React.FC<ContactSectionProps> = ({ restaurant }) => {
  const layoutClasses = useLayoutStyles()

  return (
    <Box width="100%"  sx={layoutClasses.panel}>
      <Box mb={2} width="100%">
        <ActionButtons
          buttonStyles={{
            layout: 'divided',
            buttonStyle: 'rounded'
          }}
          restaurant={restaurant}
        />
      </Box>

      <Box mt={2} width="100%">
        <Info restaurant={restaurant} withSocialLinks={true} />
      </Box>
    </Box>
  );
}

export default ContactSection