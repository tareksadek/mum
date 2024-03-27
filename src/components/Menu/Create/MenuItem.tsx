import { useSelector } from 'react-redux';
import Image from 'next/image';
import { Box, IconButton, Typography, Chip, CircularProgress } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { EditIcon, DragHandleIcon } from '../../../layout/CustomIcons';
import { ImageType } from '../../../types/restaurant';
import { ProfilePicturePlaceholderIcon } from '../../../layout/CustomIcons';
import { truncateString } from '../../../utilities/utils';

import { menuSelector } from '../../../store/selectors/menu';

import { useMenuItemStyles } from './styles';

interface MenuItemProps {
  title: string | null;
  description?: string;
  image?: ImageType | null,
  onEditMenuItem?: (sectionId: string, itemId: string) => void;
  onDeleteMenuItem?: (sectionId: string, itemId: string, itemName: string, imageUrl: string | null) => void;
  sectionId: string;
  itemId: string;
  isActive: boolean | undefined;
}

const MenuItem: React.FC<MenuItemProps> = ({
  title,
  description,
  image,
  onEditMenuItem,
  onDeleteMenuItem,
  sectionId,
  itemId,
  isActive
}) => {
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
    >
      <Box
        display="flex"
        alignItems="center"
      >
        <Box
          sx={classes.linkItemDragIcon}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          {sortingMenu ? (
            <CircularProgress size={25} />
          ) : (
            <DragHandleIcon />
          )}
        </Box>

        <Box
          display="flex"
          alignItems="center"
        >
          <Box display="flex" alignItems="flex-start" gap={1}>
            {image && image.url ? (
              <Image
                src={image.url}
                alt={title || 'item'}
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
                <b>{title}</b>
              </Typography>
              {!isActive && (
                <Chip label="Inactive" size="small" sx={classes.inactiveChip} />
              )}
            </Box>
            
            {description && (
              <Typography variant="body1" align="left">
                {truncateString(description, 20)}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
      <Box>
        {onEditMenuItem && (
          <IconButton
            onClick={() => onEditMenuItem(sectionId, itemId)}
            sx={classes.itemIconButton}
          >
            <EditIcon />
          </IconButton>
        )}
        
        {onDeleteMenuItem && (
          <IconButton
            onClick={() => onDeleteMenuItem(sectionId, itemId, title || 'this item', image && image.url ? image.url : null)}
            sx={classes.itemIconButton}
          >
            <DeleteOutlineIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

export default MenuItem;
