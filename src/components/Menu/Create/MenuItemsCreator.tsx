import React, { useState } from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Typography,
  Skeleton,
  Chip
} from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useMenuCreatorStyles } from './styles';
import { MenuSectionType, MenuItemType } from '../../../types/menu';
import { AppDispatch } from '../../../store/reducers';
import { openModal } from '../../../store/reducers/modal';
import {
  sortRestaurantSection,
  updateSectionsOrderOptimistically,
  updateSectionItemsOrderOptimistically,
  sortRestaurantMenuItem,
  deleteRestaurantMenuItem,
  removeMenuItemOptimistically,
  reAddMenuItem,
  deleteRestaurantMenuSection,
  removeSectionOptimistically,
  reAddMenuSection
} from '../../../store/reducers/menu';
import { authSelector } from '../../../store/selectors/auth';
import { restaurantSelector } from '../../../store/selectors/restaurant';
import { menuSelector } from '../../../store/selectors/menu';
import { CoverImagePlaceholderIcon } from '../../../layout/CustomIcons';
import MenuSectionDialog from './MenuSectionDialog';
import MenuItemDialog from './MenuItemDialog';
import MenuSectionAccordion from './MenuSectionAccordion';
import MenuItem from './MenuItem';

const MenuItemsCreator = () => {
  const dispatch = useDispatch<AppDispatch>();
  const classes = useMenuCreatorStyles()
  const [isEditingSection, setIsEditingSection] = useState<boolean>(false);
  const [isEditingItem, setIsEditingItem] = useState<boolean>(false);
  const [editedSection, setEditedSection] = useState<MenuSectionType | null>(null);
  const [editedItem, setEditedItem] = useState<MenuItemType | null>(null);
  const [expanded, setExpanded] = useState<string | false>(false);
  const { userId } = useSelector(authSelector);
  const { restaurantId } = useSelector(restaurantSelector);
  const { menu, menuId, menuSections, loadingMenu, sortingMenu } = useSelector(menuSelector);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
  
    // Exit if dropped outside any droppable area or didn't move
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }
  
    const sourceIdParts = source.droppableId.split('-');
    const destinationIdParts = destination.droppableId.split('-');
  
    // Handling item drag within the same section
    if (sourceIdParts[0] === 'items' && destinationIdParts[0] === 'items' && source.droppableId === destination.droppableId && menuSections) {
      const sectionId = sourceIdParts[2]; // Extract sectionId from droppableId
      const sectionIndex = menuSections.findIndex(section => section.id === sectionId);
  
      if (sectionIndex !== -1) {
        const updatedItems = Array.from(menuSections[sectionIndex].items || []);
        const [reorderedItem] = updatedItems.splice(source.index, 1);
        updatedItems.splice(destination.index, 0, reorderedItem);
  
        // Optimistically update items order in local state
        dispatch(updateSectionItemsOrderOptimistically({ sectionId, items: updatedItems }));
  
        // Persist item order changes within the section
        if (userId && restaurantId && menuId) {
          updatedItems.forEach((item, index) => {
            if (item.sortOrder !== index) {
              dispatch(sortRestaurantMenuItem({
                userId,
                restaurantId,
                menuId,
                sectionId,
                itemId: item.id,
                newSortOrder: index
              }));
            }
          });
        }
      }
    }
    // Handling section drag
    else if (sourceIdParts[0] === 'section' && destinationIdParts[0] === 'section' && menuSections) {
      const newSectionsOrder = Array.from(menuSections);
      const [reorderedSection] = newSectionsOrder.splice(source.index, 1);
      newSectionsOrder.splice(destination.index, 0, reorderedSection);
  
      // Record the original sortOrder values
      const originalOrders = menuSections.map(section => ({ id: section.id, sortOrder: section.sortOrder }));
  
      // Update sortOrder based on new index
      const updatedSections = newSectionsOrder.map((section, index) => ({
        ...section,
        sortOrder: index
      }));
  
      dispatch(updateSectionsOrderOptimistically(updatedSections));
  
      // Persisting section order changes
      if (userId && restaurantId && menuId) {
        updatedSections.forEach(section => {
          const originalOrder = originalOrders.find(o => o.id === section.id)?.sortOrder;
          if (section.sortOrder !== originalOrder) {
            dispatch(sortRestaurantSection({
              userId,
              restaurantId,
              menuId,
              sectionId: section.id,
              newSortOrder: section.sortOrder
            }));
          }
        });
      }
    }
  };

  // const onSectionDragEnd = (result: DropResult) => {
  //   const { source, destination } = result;    
  //   // If item is dropped outside the list, do nothing
  //   if (!destination) return;

  //   // If the item is dropped in the same place, do nothing
  //   if (source.index === destination.index && source.droppableId === destination.droppableId) return;

  //   if (menuSections) {
  //     const newSectionsOrder = Array.from(menuSections);
  //     const [reorderedSection] = newSectionsOrder.splice(source.index, 1);
  //     newSectionsOrder.splice(destination.index, 0, reorderedSection);

  //     // Record the original sortOrder values before updating
  //     const originalOrders = menuSections.map(section => ({ id: section.id, sortOrder: section.sortOrder }));

  //     // Update the sortOrder for all sections based on their new index
  //     const updatedSections = newSectionsOrder.map((section, index) => ({
  //       ...section,
  //       sortOrder: index
  //     }));

  //     dispatch(updateSectionsOrderOptimistically(updatedSections));

  //     if (userId && restaurantId && menuId) {
  //       updatedSections.forEach(section => {
  //         const originalOrder = originalOrders.find(o => o.id === section.id)?.sortOrder;
  //         if (section.sortOrder !== originalOrder) {
  //           dispatch(sortRestaurantSection({
  //             userId,
  //             restaurantId,
  //             menuId,
  //             sectionId: section.id,
  //             newSortOrder: section.sortOrder
  //           }));
  //         }
  //       })
  //     }
  //   }
  // };

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleAddSection = () => {
    setIsEditingSection(true);
    setEditedSection(null)
    dispatch(openModal('sectionDialog'))
  }

  const handleEditSection = (sectionId: string) => {
    setIsEditingSection(true);
    if (menuSections) {
      const editedSection = menuSections?.find(section => section.id === sectionId)
      if (editedSection) {
        setEditedSection(editedSection)
      }
      dispatch(openModal('sectionDialog'))
    }
  }

  const handleDeleteSection = (sectionId: string, sectionName: string, sectionImageUrl: string | null) => {
    let message = `Are you sure you want to delete the section "${sectionName}" and all its items? This action cannot be undone.`;
    if (!window.confirm(message)) {
      return;
    }

    if (userId && restaurantId && menuId) {
      const sectionIndex = menu?.sections?.findIndex(section => section.id === sectionId);
      let sectionData: MenuSectionType | null = null;
      if (sectionIndex !== undefined && sectionIndex >= 0 && menu && menu.sections) {
        sectionData = menu.sections[sectionIndex];
      }

      if (!sectionData) {
        console.error('Section data not found for deletion');
        return;
      }

      // Remove the section optimistically
      dispatch(removeSectionOptimistically({ sectionId }));
      dispatch(deleteRestaurantMenuSection({ userId, restaurantId, menuId, sectionId, sectionImageUrl }))
        .unwrap()
        .catch((error: any) => {
          console.error('Failed to delete the section:', error);
          // Re-add the section if deletion failed
          if (sectionData) {
            dispatch(reAddMenuSection({ sectionData }));
          }
        });
    }
  };


  const handleAddItem = (sectionId: string) => {
    setIsEditingItem(true)
    setEditedItem(null)
    if (menuSections) {
      const currentEditedSection = menuSections?.find(section => section.id === sectionId)
      if (currentEditedSection) {
        setEditedSection(currentEditedSection)
      }
      dispatch(openModal('itemDialog'))
    }
  }

  const handleEditItem = (sectionId: string, itemId: string) => {
    setIsEditingItem(true);
    if (menuSections) {
      const currentEditedSection = menuSections?.find(section => section.id === sectionId)
      const currentEditedItem = currentEditedSection?.items?.find(item => item.id === itemId)
      if (currentEditedSection) {
        setEditedSection(currentEditedSection)
      }
      if (currentEditedItem) {
        setEditedItem(currentEditedItem)
      }
      dispatch(openModal('itemDialog'))
    }
  }

  const handleDeleteItem = (sectionId: string, itemId: string, itemName: string, imageUrl: string | null) => {
    let message = `Are you sure you want to delete "${itemName}" from your menu?`;
    if (!window.confirm(message)) {
      return;
    }
    if (userId && restaurantId && menuId) {
      const sectionIndex = menu?.sections?.findIndex(section => section.id === sectionId);
      let itemData: MenuItemType | null = null;
      if (sectionIndex !== undefined && sectionIndex >= 0 && menu && menu.sections) {
        const items = menu.sections[sectionIndex].items || [];
        const itemIndex = items.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
          itemData = items[itemIndex];
        }
      }

      if (!itemData) {
        console.error('Item data not found for deletion');
        return;
      }

      dispatch(removeMenuItemOptimistically({ sectionId, itemId }));
      dispatch(deleteRestaurantMenuItem({userId, restaurantId, menuId, sectionId, itemId, imageUrl}))
      .unwrap()
      .catch((error) => {
        console.error('Failed to delete the item:', error);
        if (itemData) {
          dispatch(reAddMenuItem({ sectionId, itemData }));
        }
      });
    }
  }

  return (
    <Box>
      {loadingMenu ? (
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" width="100%">
          <Skeleton animation="wave" width="50%" height={50} />
          <Skeleton animation="wave" width="100%" height={70} />
          <Skeleton animation="wave" width="100%" height={70} />
          <Skeleton animation="wave" width="100%" height={70} />
          <Skeleton animation="wave" width="100%" height={70} />
        </Box>
      ) : (
        <Box>
          <Box mb={1} display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap={1}>
            <Typography variant="h4" align="center">{menu?.name}</Typography>
          </Box>

          <Box mb={2} display="flex" alignItems="center" justifyContent="center" flexDirection="column">
            <Chip label="Active" size="small" sx={classes.activeChip} />
          </Box>
          <DragDropContext
            onDragEnd={onDragEnd}
          >
            <Droppable
              droppableId="section"
            >
              {(provided) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {menuSections && [...menuSections].sort((a, b) => a.sortOrder - b.sortOrder).map((section, index) => (
                    <Draggable key={section.id} draggableId={section.id} index={index} isDragDisabled={sortingMenu || expanded !== false}>
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          pb={2}
                        >
                          <MenuSectionAccordion
                            title={section.name}
                            buttonOneAction={handleEditSection}
                            buttonOneText="Edit Section"
                            buttonTwoAction={handleAddItem}
                            buttonTwoText="Add Item"
                            buttonThreeAction={handleDeleteSection}
                            buttonThreeText="Delete Section"
                            sectionId={section.id}
                            isActive={section.visible}
                            expanded={expanded}
                            expandedChange={handleChange}
                            image={section.image ? section.image.url : null}
                          >
                            {section.description || (section.image && section.image.url) ? (
                              <Box mb={1} display="flex" alignItems="flex-start" gap={1}>
                                {section.image && section.image.url ? (
                                  <Image
                                    src={section.image.url}
                                    alt={section.name || 'section'}
                                    width={50}
                                    height={24}
                                    style={{
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
                            ) : (<></>)}
                            {section && section.items ? (
                              <Droppable droppableId={`items-section-${section.id}`}>
                                {(provided) => (
                                  <Box ref={provided.innerRef} {...provided.droppableProps}>
                                    {section && section.items && section.items.map((item, index) => (
                                      <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided) => (
                                          <Box
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                          >
                                            <MenuItem
                                              title={item.name}
                                              description={item.description}
                                              image={item.image}
                                              onEditMenuItem={handleEditItem}
                                              onDeleteMenuItem={handleDeleteItem}
                                              sectionId={section.id}
                                              itemId={item.id}
                                              isActive={item.visible}
                                            />
                                          </Box>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                  </Box>
                                )}
                              </Droppable>
                            ) : (
                              <Button
                                onClick={() => handleAddItem(section.id)}
                                variant="outlined"
                                color="secondary"
                                fullWidth
                              >
                                Add Item
                              </Button>
                            )}
                          </MenuSectionAccordion>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            mt={2}
          >
            <Box width="100%">
              <Button
                onClick={handleAddSection}
                variant="outlined"
                color="secondary"
                fullWidth
              >
                Add Section
              </Button>
            </Box>
          </Box>
        </Box>
      )}
      {isEditingSection && (
        <MenuSectionDialog
          section={editedSection}
          setIsEditingSection={setIsEditingSection}
        />
      )}
      {isEditingItem && (
        <MenuItemDialog
          item={editedItem}
          section={editedSection}
          setIsEditingItem={setIsEditingItem}
        />
      )}
    </Box>
  );
}

export default MenuItemsCreator;
