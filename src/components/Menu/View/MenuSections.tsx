import React, { useState } from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/reducers';
import {
  Box,
  Typography,
} from '@mui/material';
import { CoverImagePlaceholderIcon } from '../../../layout/CustomIcons';

import { menuSelector } from '../../../store/selectors/menu';
import MenuSection from './MenuSection';
import MenuItem from './MenuItem';
import ItemDetailsModal from './ItemDetailsModal';
import { MenuItemType, MenuSectionType } from '../../../types/menu';

import { openModal } from '../../../store/reducers/modal';

interface MenuSectionsProps {
  sections: MenuSectionType[] | null;
}

const MenuSections: React.FC<MenuSectionsProps> = ({ sections }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [viewedItem, setViewedItem] = useState<MenuItemType | null>(null);
  const [isViewingItem, setIsViewingItem] = useState<boolean>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const onItemClick = (item: MenuItemType) => {
    setIsViewingItem(true);
    setViewedItem(item)
    dispatch(openModal('itemDetailsDialog'))
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {sections && [...sections].sort((a, b) => a.sortOrder - b.sortOrder).map((section, index) => (
        <Box key={section.id}>
          {section && section.items && (
            <MenuSection
              title={section.name}
              sectionId={section.id}
              expanded={expanded}
              expandedChange={handleChange}
              image={section.image ? section.image.url : null}
            >
              {section.description || (section.image && section.image.url) ? (
                <Box mb={1} display="flex" alignItems="flex-start" gap={1}>
                  {section.image && section.image.url ? (
                    // <Image
                    //   src={section.image.url}
                    //   alt={section.name || 'section'}
                    //   width={50}
                    //   height={24}
                    //   style={{
                    //     borderRadius: 4,
                    //   }}
                    // />
                    <img
                      src={section.image.url}
                      alt={section.name || 'section'}
                      style={{
                        width: 50,
                        height: 40,
                        objectFit: 'cover',
                        borderRadius: 4,
                      }}
                    />
                  ) : (
                    <CoverImagePlaceholderIcon
                      style={{
                        fontSize: 30
                      }}
                    />
                  )}
                  {section.description && (
                    <Typography variant="body1" align="left">
                      {section.description}
                    </Typography>
                  )}
                </Box>
              ) : null}

              {section && section.items && section.items.map((item, index) => (
                <MenuItem
                  key={item.id}
                  item={item}
                  onItemClick={onItemClick}
                />
              ))}
            </MenuSection>
          )}
        </Box>
      ))}
      {isViewingItem && viewedItem && (
        <ItemDetailsModal
          item={viewedItem}
          setViewedItem={setViewedItem}
          setIsViewingItem={setIsViewingItem}
        />
      )}
    </Box>
  )
}

export default MenuSections