import React, {
  useEffect,
  useContext,
} from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { AppDispatch } from '../../store/reducers';
import { SubmitContext } from '../../contexts/SubmitContext';
import { fetchAllRestaurantMenus } from '../../store/reducers/restaurant';
import { fetchRestaurantMenu } from '../../store/reducers/menu';
import { authSelector } from '../../store/selectors/auth';
import { restaurantSelector } from '../../store/selectors/restaurant';
import { menuSelector } from '../../store/selectors/menu';
import AppLayout from '../../layout/AppLayout';
import MenuItemsCreator from '../../components/Menu/Create/MenuItemsCreator';

const Menu: React.FC = () => {
  const { userId } = useSelector(authSelector);
  const { restaurantId, restaurantMenus } = useSelector(restaurantSelector);
  const { menu } = useSelector(menuSelector);
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { menuId } = router.query; 

  // useEffect(() => {
  //   if (restaurantId && userId && !restaurantMenus) {
  //     dispatch(fetchAllRestaurantMenus({ userId, restaurantId }))
  //   }
  // }, [restaurantId, userId, restaurantMenus, dispatch]);

  useEffect(() => {
    if (userId && restaurantId && menuId && typeof menuId === 'string' && !menu) {
      dispatch(fetchRestaurantMenu({ userId, restaurantId, menuId }));
    }
  }, [userId, restaurantId, menuId, menu, dispatch]);

  return (
    <AppLayout>
      <Box p={2}>
        <MenuItemsCreator />
      </Box>
    </AppLayout>
  );
}

export default Menu;
