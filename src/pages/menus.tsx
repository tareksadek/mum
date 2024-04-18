import React, {
  useEffect
} from 'react';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../store/reducers';
import { Box, Typography } from '@mui/material';
import { menuSelector } from '../store/selectors/menu';
import { restaurantSelector } from '../store/selectors/restaurant';
import { authSelector } from '../store/selectors/auth';
import AppLayout from '../layout/AppLayout';
import { fetchRestaurantMenu } from '@/store/reducers/menu';
import MenuCreator from '../components/Menu/Create/MenuCreator';

const Menus: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); 
  const { restaurantId, activeMenuId, loadingRestaurant } = useSelector(restaurantSelector);
  const { userId } = useSelector(authSelector);
  const { menuId, menu } = useSelector(menuSelector);

  useEffect(() => {
    if (userId && restaurantId && activeMenuId && !menuId) {
      dispatch(fetchRestaurantMenu({ userId, restaurantId, menuId: activeMenuId }))
    }
  }, [dispatch, activeMenuId, restaurantId, userId, menuId]);

  return (
    <AppLayout>
      <Box p={2}>
        <MenuCreator
          menus={menu ? [menu] : null}
          loading={loadingRestaurant}
        />
      </Box>
    </AppLayout>
  );
}

export default Menus;
