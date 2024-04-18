import { useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers';
import Box from '@mui/material/Box';
import { SocialIcon } from 'react-social-icons';
import { incrementLinkClickCount, incrementTeamLinkClickCount } from '../../../API/restaurant';
import { LinkType } from '../../../types/restaurant';
import { RestaurantDataType } from '../../../types/restaurant';
import { restaurantSelector } from '../../../store/selectors/restaurant';

interface LinksProps {
  linksStyles: {
    socialLinksStyle: string | null;
    align?: string | null;
    noBackground?: boolean;
    size?: number | null;
  },
  restaurant: RestaurantDataType;
}

const SocialLinks: React.FC<LinksProps> = ({ linksStyles, restaurant }) => {
  const theme = useTheme()
  const setup = useSelector((state: RootState) => state.setup.setup);
  const user = useSelector((state: RootState) => state.user.user);
  const isLoggedIn = useSelector((state: RootState) => state.authUser.isLoggedIn); 
  const authId = useSelector((state: RootState) => state.authUser.userId); 
  const { restaurantLinks } = useSelector(restaurantSelector);
  const isAccountOwner = isLoggedIn && (authId === user?.id)
  const themeColorName = restaurant?.themeSettings ? restaurant?.themeSettings.selectedColor.name : ''
  const themeColorCode = restaurant?.themeSettings ? restaurant?.themeSettings.selectedColor.code : ''
  const backgroundColor = themeColorName !== 'grey' && themeColorCode ? themeColorCode : null;
  const socialLinksToSelectedColor = restaurant?.themeSettings ? restaurant?.themeSettings.socialLinksToSelectedColor : false
  const isTeamMember = user?.isTeamMember
  const teamId = user?.batchId

  const iconColor = theme.palette.mode === 'light' ? theme.palette.background.link : theme.palette.background.reverse

  let links;

  if (setup && setup.links) {
    links = setup.links;
  } else if (restaurant && restaurantLinks) {
    links = restaurantLinks;
  }

  const sortedLinks = links && links.social
    ? [...links.social]
      .filter(link => link.active)
      .sort((a, b) => a.position - b.position)
    : [];

  const handleLinkClick = async (link: LinkType) => {
    if((!isLoggedIn || !isAccountOwner) && user && user.id && restaurant && restaurant.id && link && link.id) {
      if (isTeamMember && teamId) {
        await incrementTeamLinkClickCount(user.id, teamId, link.id)
      } else {
        await incrementLinkClickCount(user.id, restaurant.id, link.id);
      }
    }
  }

  return (
    <>
      {links && links.social && links.social.length > 0 && (
        <Box width="100%">
          <Box
            display="flex"
            alignItems="center"
            justifyContent={linksStyles.align || (links.social.length >= 8 ? "flex-start" : "center")}
            flexWrap="wrap"
            gap={linksStyles.size && linksStyles.size < 50 ? 1 : 2}
          >
            {sortedLinks.map((link, index) => (
              <SocialIcon
                key={link.id || index}
                network={link.platform}
                url={link.url}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link);
                  window.open(link.url, '_blank', 'noopener,noreferrer');
                }}
                style={{
                  width: linksStyles.size || 50,
                  height: linksStyles.size || 50
                }}
                {...(linksStyles.noBackground ? { fgColor: iconColor || '#ffffff' } : {})}
                {...(linksStyles.noBackground ? { bgColor: 'transparent' } : (socialLinksToSelectedColor && backgroundColor ? { bgColor: backgroundColor } : {}))}
                label={`Visit ${restaurant?.basicInfoData?.firstName || ''} ${restaurant?.basicInfoData?.lastName || ''} ${link.platform}`}
              />
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default SocialLinks;
