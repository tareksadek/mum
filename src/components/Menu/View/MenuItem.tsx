import { useSelector } from 'react-redux';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';
import { MenuItemPlaceholderIcon } from '../../../layout/CustomIcons';
import { truncateString } from '../../../utilities/utils';
import { MenuItemType } from '../../../types/menu';

import { menuSelector } from '../../../store/selectors/menu';

import { useMenuItemStyles } from './styles';

import { currencies } from '../../../setup/setup';

interface MenuItemProps {
  item: MenuItemType;
  onItemClick: (item: MenuItemType) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onItemClick }) => {
  const classes = useMenuItemStyles();
  const { menuCurrency } = useSelector(menuSelector);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      p={2}
      mb={2}
      onClick={() => onItemClick(item)}
      sx={{
        ...classes.menuItemContainer,
        '&:last-child': {
          marginBottom: 0,
        },
      }}
    >
      <Box
        display="flex"
        alignItems="flex-start"
        width="100%"
      >
        <Box display="flex" alignItems="flex-start" gap={1}>
          {item.image && item.image.url ? (
            // <Image
            //   src={item.image.url}
            //   alt={item.name || 'item'}
            //   width={60}
            //   height={60}
            //   style={{
            //     borderRadius: 100,
            //   }}
            // />
            <img
              src={item.image.url}
              alt={item.name || 'item'}
              style={{
                width: 60,
                height: 60,
                objectFit: 'cover',
                borderRadius: 100,
              }}
            />
          ) : (
            <MenuItemPlaceholderIcon
              style={{
                fontSize: 60
              }}
            />
          )}
        </Box>
        <Box
          ml={2}
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
          flexWrap="wrap"
          width="100%"
        >
          <Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Typography variant="body1" align="left">
                <b>{item.name}</b>
              </Typography>
            </Box>
            {item.description && (
              <Typography variant="body1" align="left" sx={classes.itemDescription}>
                {truncateString(item.description, 20)}
              </Typography>
            )}
          </Box>
          {item.newPrice && (
            <Box>
              <Typography variant="body1" align="right" sx={classes.newPrice}>
                {menuCurrency && menuCurrency !== '' ? currencies.find(currency => currency.code === menuCurrency)?.symbol : '$'}
                {item.newPrice}
              </Typography>
              {item.oldPrice && (
                <Typography variant="body1" align="right" sx={classes.oldPrice}>
                  {menuCurrency && menuCurrency !== '' ? currencies.find(currency => currency.code === menuCurrency)?.symbol : '$'}
                  {item.oldPrice}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default MenuItem;
