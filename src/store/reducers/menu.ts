import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './';
import {
  createMenu,
  editMenu,
  createMenuSection,
  createMenuItem,
  editMenuSection,
  editMenuItem,
  deleteMenuItem,
  deleteMenuSection,
  updateSectionSortOrder,
  updateItemSortOrder,
  fetchMenu,
} from '../../API/restaurant';
import {
  MenuType,
  MenuSectionType,
  MenuItemType
} from '../../types/menu';
import { startLoading, stopLoading } from './loadingCenter';
import { updateMenus } from './restaurant';
import { setNotification } from './notificationCenter';

interface MenuState {
  menu: MenuType | null;
  originalSections: MenuSectionType[];
  sorting: boolean;
  editing: boolean;
  creating: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  menu: null,
  originalSections: [],
  sorting: false,
  editing: false,
  creating: false,
  loading: false,
  error: null,
};

export const createRestaurantMenu = createAsyncThunk<MenuType | undefined, { userId: string; restaurantId: string; menuData?: MenuType }, { rejectWithValue: Function, state: RootState }>(
  'restaurant/createMenu',
  async (
    { userId, restaurantId, menuData },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(startLoading('Creating menu...')); 
    if (menuData) {
      try {
        const response = await createMenu(userId, restaurantId, menuData);
  
        if (response.success && response.data) {
          dispatch(stopLoading());
          dispatch(updateMenus(response.data))
          return response.data;
        } else {
          dispatch(stopLoading());
          return rejectWithValue(response.error);
        }
      } catch (error) {
        dispatch(stopLoading());
        return rejectWithValue((error as Error).message);
      }
    } else {
      dispatch(stopLoading());
      return rejectWithValue("Error: Menu data not available");
    }
  }
);

export const editRestaurantMenu = createAsyncThunk<MenuType | undefined, { userId: string; restaurantId: string; menuId: string; menuData: MenuType }, { rejectWithValue: Function, state: RootState }>(
  'restaurant/editMenu',
  async (
    { userId, restaurantId, menuId, menuData },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(startLoading('Editing menu...'));
    try {
      const response = await editMenu(userId, restaurantId, menuId, menuData);

      if (response.success && response.data) {
        dispatch(stopLoading());
        return response.data;
      } else {
        dispatch(stopLoading());
        return rejectWithValue(response.error);
      }
    } catch (error) {
      dispatch(stopLoading());
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createRestaurantMenuSection = createAsyncThunk(
  'restaurant/createMenuSection',
  async (
    { userId, restaurantId, menuId, sectionData }: { userId: string; restaurantId: string; menuId: string; sectionData: MenuSectionType },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await createMenuSection(userId, restaurantId, menuId, sectionData);

      if (response.success && response.data) {
        return response.data;
      } else {
        dispatch(setNotification({ message: 'Failed to create section', type: 'error', horizontal: 'center', vertical: 'top' }));
        return rejectWithValue(response.error);
      }
    } catch (error) {
      dispatch(setNotification({ message: 'Failed to create section', type: 'error', horizontal: 'center', vertical: 'top' }));
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createRestaurantMenuItem = createAsyncThunk(
  'restaurant/createMenuItem',
  async (
    { userId, restaurantId, menuId, sectionId, itemData }: { userId: string; restaurantId: string; menuId: string; sectionId: string; itemData: MenuItemType },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await createMenuItem(userId, restaurantId, menuId, sectionId, itemData);

      if (response.success && response.data) {
        // Include sectionId in the returned payload for easier reducer handling
        return { ...response.data, sectionId }; // Assumes response.data is the item data
      } else {
        dispatch(setNotification({ message: 'Failed to create item', type: 'error', horizontal: 'center', vertical: 'top' }));
        return rejectWithValue(response.error);
      }
    } catch (error) {
      dispatch(setNotification({ message: 'Failed to create item', type: 'error', horizontal: 'center', vertical: 'top' }));
      return rejectWithValue((error as Error).message);
    }
  }
);

export const editRestaurantSection = createAsyncThunk(
  'restaurant/editMenuSection',
  async (
    { userId, restaurantId, menuId, sectionId, sectionData }: { userId: string; restaurantId: string; menuId: string; sectionId: string; sectionData: MenuSectionType },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await editMenuSection(userId, restaurantId, menuId, sectionId, sectionData);

      // Check if the operation was successful and 'data' is present
      if ('success' in response && response.success && 'data' in response && response.data) {
        response.data.id = sectionId
        return response.data
      } else if ('error' in response) {
        // Handle the case where 'error' is present
        dispatch(setNotification({ message: 'Failed to edit section', type: 'error', horizontal: 'center', vertical: 'top' }));
        return rejectWithValue(response.error);
      } else {
        // Handle any unexpected response shape
        dispatch(setNotification({ message: 'Failed to edit section', type: 'error', horizontal: 'center', vertical: 'top' }));
        return rejectWithValue("Unexpected response from editMenuSection");
      }
    } catch (error) {
      dispatch(setNotification({ message: 'Failed to edit section', type: 'error', horizontal: 'center', vertical: 'top' }));
      return rejectWithValue((error as Error).message);
    }
  }
);

export const editRestaurantMenuItem = createAsyncThunk(
  'restaurant/editMenuItem',
  async (
    { userId, restaurantId, menuId, sectionId, itemId, itemData }: { userId: string; restaurantId: string; menuId: string; sectionId: string; itemId: string; itemData: MenuItemType },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await editMenuItem(userId, restaurantId, menuId, sectionId, itemId, itemData);

      if ('success' in response && response.success && 'data' in response && response.data) {
        response.data.id = itemId
        response.data.sectionId = sectionId
        return response.data
      } else if ('error' in response){
        dispatch(setNotification({ message: 'Failed to edit item', type: 'error', horizontal: 'center', vertical: 'top' }));
        return rejectWithValue(response.error);
      } else {
        dispatch(setNotification({ message: 'Failed to edit item', type: 'error', horizontal: 'center', vertical: 'top' }));
        return rejectWithValue("Unexpected response from editMenuItem");
      }
    } catch (error) {
      dispatch(setNotification({ message: 'Failed to edit item', type: 'error', horizontal: 'center', vertical: 'top' }));
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteRestaurantMenuItem = createAsyncThunk(
  'restaurant/deleteRestaurantMenuItem',
  async (
    { userId, restaurantId, menuId, sectionId, itemId, imageUrl }: 
    { userId: string; restaurantId: string; menuId: string; sectionId: string; itemId: string; imageUrl: string | null; },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await deleteMenuItem(userId, restaurantId, menuId, sectionId, itemId, imageUrl);
      if (response.success) {
        // Dispatch a notification for successful deletion
        dispatch(setNotification({ message: 'Item deleted successfully', type: 'success', horizontal: 'center', vertical: 'top' }));
        return { itemId, sectionId }; // Return IDs to find and remove the item in the slice
      } else {
        dispatch(setNotification({ message: 'Failed to delete item', type: 'error', horizontal: 'center', vertical: 'top' }));
        return rejectWithValue(response.error);
      }
    } catch (error) {
      dispatch(setNotification({ message: 'Failed to delete item', type: 'error', horizontal: 'center', vertical: 'top' }));
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteRestaurantMenuSection = createAsyncThunk(
  'restaurant/deleteRestaurantMenuSection',
  async (
    { userId, restaurantId, menuId, sectionId, sectionImageUrl }: 
    { userId: string; restaurantId: string; menuId: string; sectionId: string; sectionImageUrl: string | null },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await deleteMenuSection(userId, restaurantId, menuId, sectionId, sectionImageUrl);
      if (response.success) {
        dispatch(setNotification({ message: 'Section deleted successfully', type: 'success', horizontal: 'center', vertical: 'top' }));
        return { sectionId }; // Return sectionId to remove the section from the slice
      } else {
        dispatch(setNotification({ message: 'Failed to delete section', type: 'error', horizontal: 'center', vertical: 'top' }));
        return rejectWithValue(response.error);
      }
    } catch (error) {
      dispatch(setNotification({ message: 'Failed to delete section', type: 'error', horizontal: 'center', vertical: 'top' }));
      return rejectWithValue((error as Error).message);
    }
  }
);

export const sortRestaurantSection = createAsyncThunk(
  'restaurant/sortSection',
  async (
    { userId, restaurantId, menuId, sectionId, newSortOrder }: 
    { userId: string; restaurantId: string; menuId: string; sectionId: string; newSortOrder: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateSectionSortOrder(userId, restaurantId, menuId, sectionId, newSortOrder);

      if (response.success) {
        return { sectionId, newSortOrder };
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const sortRestaurantMenuItem = createAsyncThunk(
  'restaurant/sortMenuItem',
  async (
    { userId, restaurantId, menuId, sectionId, itemId, newSortOrder }: 
    { userId: string; restaurantId: string; menuId: string; sectionId: string; itemId: string; newSortOrder: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateItemSortOrder(userId, restaurantId, menuId, sectionId, itemId, newSortOrder);

      if (response.success) {
        // Return the sectionId, itemId, and newSortOrder to reflect changes in the state
        return { sectionId, itemId, newSortOrder };
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchRestaurantMenu = createAsyncThunk<
  MenuType,
  { userId: string; restaurantId: string; menuId: string },
  { rejectValue: string }
>(
  'menu/fetchRestaurantMenu',
  async ({ userId, restaurantId, menuId }, { rejectWithValue }) => {
    try {
      const response = await fetchMenu(userId, restaurantId, menuId);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.error || "An unexpected error occurred");
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const menuSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    updateMenu: (state, action) => {
      state.menu = { ...state.menu, ...action.payload };
    },
    updateSectionsOrderOptimistically: (state, action) => {
      if (state.menu?.sections) {
        state.originalSections = state.menu.sections;
        state.menu.sections = action.payload;
      }
    },
    updateSectionItemsOrderOptimistically: (state, action) => {
      const { sectionId, items } = action.payload;
      const sectionIndex = state.menu?.sections?.findIndex(s => s.id === sectionId);
      if (sectionIndex && sectionIndex !== -1 && state.menu?.sections) {
        state.menu.sections[sectionIndex].items = items;
      }
    },
    removeMenuItemOptimistically: (state, action: PayloadAction<{ sectionId: string; itemId: string }>) => {
      const { sectionId, itemId } = action.payload;
      const sectionIndex = state.menu?.sections?.findIndex(section => section.id === sectionId);
      if (sectionIndex !== undefined && sectionIndex >= 0 && state.menu && state.menu.sections) {
        const items = state.menu.sections[sectionIndex].items;
        if (items) {
          const itemIndex = items.findIndex(item => item.id === itemId);
          if (itemIndex !== -1) {
            items.splice(itemIndex, 1);
          }
        }
      }
    },
    reAddMenuItem: (state, action: PayloadAction<{ sectionId: string; itemData: MenuItemType }>) => {
      const { sectionId, itemData } = action.payload;
      const sectionIndex = state.menu?.sections?.findIndex(section => section.id === sectionId);
      if (sectionIndex !== undefined && sectionIndex >= 0 && state.menu && state.menu.sections) {
        const items = state.menu.sections[sectionIndex].items || [];
        // Assuming you want to add the item back at its original index based on sortOrder
        // This may need adjustment based on your sorting/ordering logic
        const insertIndex = items.findIndex(item => item.sortOrder > itemData.sortOrder);
        if (insertIndex !== -1) {
          items.splice(insertIndex, 0, itemData);
        } else {
          // If no items have a greater sortOrder, add it to the end
          items.push(itemData);
        }
      }
    },
    removeSectionOptimistically: (state, action: PayloadAction<{ sectionId: string }>) => {
      const { sectionId } = action.payload;
      if (state.menu?.sections) {
        const sectionIndex = state.menu.sections.findIndex(section => section.id === sectionId);
        if (sectionIndex !== -1) {
          // Remove the section optimistically
          state.menu.sections.splice(sectionIndex, 1);
        }
      }
    },
    reAddMenuSection: (state, action: PayloadAction<{ sectionData: MenuSectionType }>) => {
      const { sectionData } = action.payload;
      // Assuming sections are sorted by a sortOrder property
      if (state.menu && state.menu.sections) {
        const insertIndex = state.menu?.sections.findIndex(section => section.sortOrder > sectionData.sortOrder);
        if (insertIndex !== -1) {
          // Insert the section back at its original position if possible
          state.menu?.sections.splice(insertIndex, 0, sectionData);
        } else {
          // If no sections have a greater sortOrder, or if insertIndex is -1, add it to the end
          state.menu?.sections.push(sectionData);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRestaurantMenu.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRestaurantMenu.fulfilled, (state, action: PayloadAction<MenuType | undefined>) => {
        state.loading = false;
        if (action.payload) { 
          state.menu = {
            ...action.payload,
          };
       }
        state.error = null;
      })
      .addCase(createRestaurantMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(editRestaurantMenu.pending, (state) => {
        state.loading = true;
      })
      .addCase(editRestaurantMenu.fulfilled, (state, action: PayloadAction<MenuType | undefined>) => {
        state.loading = false;
        if (action.payload && state.menu) {
          state.menu.currency = action.payload.currency;
          state.menu.isActive = action.payload.isActive;
          state.menu.name = action.payload.name;
          state.error = null;
        }
      })
      .addCase(editRestaurantMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });


    builder
      .addCase(createRestaurantMenuSection.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRestaurantMenuSection.fulfilled, (state, action: PayloadAction<MenuSectionType>) => {
        state.loading = false;
        if (state.menu) {
          if (!state.menu.sections) {
            state.menu.sections = [];
          }
          
          state.menu.sections.push(action.payload);
        }
        state.error = null;
      })
      .addCase(createRestaurantMenuSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createRestaurantMenuItem.pending, (state) => {
        state.creating = true;
      })
      .addCase(createRestaurantMenuItem.fulfilled, (state, action: PayloadAction<MenuItemType>) => {
        if (action.payload) {
          const sectionIndex = state.menu?.sections?.findIndex(s => s.id === action.payload.sectionId);
          if (sectionIndex !== undefined && sectionIndex !== -1 && state.menu && state.menu.sections) {
            // Ensure there's an items array to push to
            if (!state.menu.sections[sectionIndex].items) {
              state.menu.sections[sectionIndex].items = [];
            }
            // Push the new item, omitting the sectionId for the stored item
            const { sectionId, ...itemWithoutSectionId } = action.payload;
            state.menu.sections![sectionIndex].items!.push(itemWithoutSectionId);
          }
        } else {
          console.error('Failed to add the menu item, payload is null or undefined');
        }
        state.creating = false;
        state.error = null;
      })
      .addCase(createRestaurantMenuItem.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(editRestaurantSection.pending, (state) => {
        state.editing = true;
      })
      .addCase(editRestaurantSection.fulfilled, (state, action: PayloadAction<MenuSectionType>) => {
        if (state.menu && state.menu?.sections) {
          const index = state.menu.sections.findIndex(section => section.id === action.payload.id);
          if (index !== -1) {
            state.menu.sections[index] = { ...action.payload };
          }
        }
        state.editing = false;
        state.error = null;
      })
      .addCase(editRestaurantSection.rejected, (state, action) => {
        state.editing = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(editRestaurantMenuItem.pending, (state) => {
        state.editing = true;
      })
      .addCase(editRestaurantMenuItem.fulfilled, (state, action: PayloadAction<MenuItemType>) => {
        // Locate the section and then the item to update
        const sectionIndex = state.menu?.sections?.findIndex(section => section.id === action.payload.sectionId);
        if (state.menu && sectionIndex !== undefined && sectionIndex >= 0) {
          // Asserting the existence of `sections` array with non-null assertion operator (!)
          const items = state.menu.sections![sectionIndex].items!;
          const itemIndex = items.findIndex(item => item.id === action.payload.id);
          if (itemIndex !== -1) {
            items[itemIndex] = { ...action.payload };
          }
        }
        state.editing = false;
        state.error = null;
      })
      .addCase(editRestaurantMenuItem.rejected, (state, action) => {
        state.editing = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteRestaurantMenuItem.pending, (state) => {
        // state.loading = true;
      })
      .addCase(deleteRestaurantMenuItem.fulfilled, (state, action: PayloadAction<{ itemId: string; sectionId: string }>) => {
        const { itemId, sectionId } = action.payload;
        const sectionIndex = state.menu?.sections?.findIndex(section => section.id === sectionId);
        if (state.menu && sectionIndex !== undefined && sectionIndex >= 0) {
          const items = state.menu.sections![sectionIndex].items!;
          const itemIndex = items.findIndex(item => item.id === itemId);
          if (itemIndex !== -1) {
            // Remove the item from the section
            items.splice(itemIndex, 1);
          }
        }
        // state.loading = false;
        state.error = null;
      })
      .addCase(deleteRestaurantMenuItem.rejected, (state, action) => {
        // state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteRestaurantMenuSection.pending, (state) => {
        // Handle pending state if needed
      })
      .addCase(deleteRestaurantMenuSection.fulfilled, (state, action: PayloadAction<{ sectionId: string }>) => {
        const { sectionId } = action.payload;
        if (state.menu?.sections) {
          const sectionIndex = state.menu.sections.findIndex(section => section.id === sectionId);
          if (sectionIndex !== -1) {
            state.menu.sections.splice(sectionIndex, 1); 
          }
        }
        state.error = null;
      })
      .addCase(deleteRestaurantMenuSection.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    builder
      .addCase(sortRestaurantSection.pending, (state) => {
        state.sorting = true;
      })
      .addCase(sortRestaurantSection.fulfilled, (state, action: PayloadAction<{ sectionId: string; newSortOrder: number }>) => {
        if (state.menu?.sections) {
          const { sectionId, newSortOrder } = action.payload;
          const sectionIndex = state.menu.sections.findIndex(section => section.id === sectionId);
          if (sectionIndex !== -1) {
            // Update the sortOrder of the section
            state.menu.sections[sectionIndex].sortOrder = newSortOrder;
            // Optionally, you might want to sort the sections array based on sortOrder here
            state.menu.sections.sort((a, b) => a.sortOrder - b.sortOrder);
          }
        }
        state.error = null;
        state.sorting = false;
      })
      .addCase(sortRestaurantSection.rejected, (state, action) => {
        state.error = action.payload as string;
        state.sorting = false;
        if (state.menu?.sections) {
          state.menu.sections = state.originalSections
        }
      });

    builder
      .addCase(sortRestaurantMenuItem.pending, (state) => {
        state.sorting = true;
      })
      .addCase(sortRestaurantMenuItem.fulfilled, (state, action: PayloadAction<{ sectionId: string; itemId: string; newSortOrder: number }>) => {
        const { sectionId, itemId, newSortOrder } = action.payload;

        // Find the section and item to update
        const section = state.menu?.sections?.find(section => section.id === sectionId);
        if (section) {
          const itemIndex = section.items?.findIndex(item => item.id === itemId);
          if (itemIndex !== undefined && itemIndex >= 0) {
            // Update the sortOrder of the item
            if (section.items) {
              section.items[itemIndex].sortOrder = newSortOrder;
              // Optionally, you might want to sort the items array based on sortOrder here
              section.items.sort((a, b) => a.sortOrder - b.sortOrder);
            }
          }
        }
        state.error = null;
        state.sorting = false;
      })
      .addCase(sortRestaurantMenuItem.rejected, (state, action) => {
        state.error = action.payload as string;
        state.sorting = false;
      });

    builder
      .addCase(fetchRestaurantMenu.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRestaurantMenu.fulfilled, (state, action: PayloadAction<MenuType | undefined>) => {
        state.loading = false;
        if (action.payload) { 
          state.menu = action.payload
        };
        state.error = null;
      })
      .addCase(fetchRestaurantMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Set the error message
      });
  },
});

export const {
  updateMenu,
  updateSectionsOrderOptimistically,
  updateSectionItemsOrderOptimistically,
  removeMenuItemOptimistically,
  reAddMenuItem,
  removeSectionOptimistically,
  reAddMenuSection
} = menuSlice.actions;
export default menuSlice.reducer;