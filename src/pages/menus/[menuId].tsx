import React, {
  useEffect,
  useContext,
  lazy,
  Suspense
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
import AppLayout from '../../layout/AppLayout';

const MenuItemsCreator = lazy(() => import('../../components/Menu/Create/MenuItemsCreator'));

const Menu: React.FC = () => {
  const { userId } = useSelector(authSelector);
  const { restaurantId, restaurantMenus } = useSelector(restaurantSelector);
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { menuId } = router.query; 

  useEffect(() => {
    if (restaurantId && userId && !restaurantMenus) {
      dispatch(fetchAllRestaurantMenus({ userId, restaurantId }))
    }
  }, [restaurantId, userId, restaurantMenus, dispatch]);

  useEffect(() => {
    if (userId && restaurantId && menuId && typeof menuId === 'string') {
      dispatch(fetchRestaurantMenu({ userId, restaurantId, menuId }));
    }
  }, [userId, restaurantId, menuId, dispatch]);

  return (
    <AppLayout>
      <Box p={2}>
        <Suspense
          fallback={(
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              p={2}  
            >
              <Typography align='center' variant='body1'>Loading...</Typography>
            </Box>
          )}
        >
          <MenuItemsCreator />
        </Suspense>
      </Box>
    </AppLayout>
  );
}

export default Menu;
