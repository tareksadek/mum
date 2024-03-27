import { useSelector } from 'react-redux';
import Image from 'next/image';
import { Box, Typography, CircularProgress } from '@mui/material';
import { ProfilePicturePlaceholderIcon } from '../../../layout/CustomIcons';
import { truncateString } from '../../../utilities/utils';
import { MenuItemType } from '../../../types/menu';

import { menuSelector } from '../../../store/selectors/menu';

import { useMenuItemStyles } from './styles';

interface MenuItemProps {
  item: MenuItemType;
  onItemClick: (item: MenuItemType) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onItemClick }) => {
  const classes = useMenuItemStyles();
  const { sortingMenu } = useSelector(menuSelector);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      sx={classes.menuItemContainer}
      p={1}
      mb={1}
      onClick={() => onItemClick(item)}
    >
      <Box
        display="flex"
        alignItems="center"
      >
        <Box
          display="flex"
          alignItems="center"
        >
          <Box display="flex" alignItems="flex-start" gap={1}>
            {item.image && item.image.url ? (
              <Image
                src={item.image.url}
                alt={item.name || 'item'}
                width={30}
                height={30}
                style={{
                  borderRadius: 4,
                }}
              />
            ) : (
              <ProfilePicturePlaceholderIcon
                style={{
                  fontSize: 30
                }}
              />
            )}
          </Box>
          <Box ml={1}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Typography variant="body1" align="left">
                <b>{item.name}</b>
              </Typography>
            </Box>
            
            {item.description && (
              <Typography variant="body1" align="left">
                {truncateString(item.description, 20)}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default MenuItem;
