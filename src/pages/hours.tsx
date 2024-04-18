import React, {
  useEffect,
  useState,
  useCallback,
  useContext
} from 'react';
import _ from 'lodash';
import { Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useForm, useFieldArray } from 'react-hook-form';
import { AppDispatch } from '../store/reducers';
import { WorkingDaysForm } from '../types/restaurant';
import { useRegisterSubmit, SubmitContext } from '../contexts/SubmitContext';
import { updateWorkingDays } from '../store/reducers/restaurant';
import { useLayoutStyles } from '../theme/layout';
import SaveButton from '../layout/SaveButton';
import { authSelector } from '../store/selectors/auth';
import { restaurantSelector } from '../store/selectors/restaurant';
import AppLayout from '../layout/AppLayout';
import WorkingHoursCreator from '../components/Restaurant/WorkingHoursCreator';

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const defaultValues = {
  workingDays: dayNames.map((dayName: string) => ({
    active: false,
    dayName,
    workingHours: [{ from: '', to: '' }],
  })),
}

const Hours: React.FC = () => {
  const layoutClasses = useLayoutStyles()
  const [expanded, setExpanded] = useState<string | false>(false);
  const { userId, currentUser } = useSelector(authSelector);
  const { restaurant, restaurantId, workingDays } = useSelector(restaurantSelector);
  const registerSubmit = useRegisterSubmit();
  const context = useContext(SubmitContext);
  if (!context) throw new Error('Context not available');
  const { setFormChanged, setFormValid, formValid, formChanged } = context;
  const dispatch = useDispatch<AppDispatch>();

  const { control, register, handleSubmit, formState: { errors, isValid }, setValue, watch } = useForm<WorkingDaysForm>({ defaultValues });

  const watchedValues = watch();  

  const { fields } = useFieldArray({
    control,
    name: "workingDays",
  });

  useEffect(() => {
    if (workingDays && workingDays.length > 0) {
      setValue('workingDays', workingDays.map(day => ({
        ...day,
        active: day.active,
        workingHours: day.workingHours && day.workingHours.length > 0 
          ? day.workingHours 
          : [{ from: '', to: '' }],
      })));
    }
  }, [workingDays, setValue]);

  const handleWorkingDaysSubmit = useCallback((workingDays: WorkingDaysForm) => {
    if (!userId || !currentUser) {
      return;
    }
    if (restaurantId) {
      dispatch(updateWorkingDays({userId, restaurantId, workingDays}))
    }
  }, [userId, dispatch, currentUser, restaurantId]);

  useEffect(() => {
    registerSubmit(() => handleSubmit(handleWorkingDaysSubmit)());
  }, [registerSubmit, handleSubmit, handleWorkingDaysSubmit]);

  useEffect(() => {
    setFormValid(isValid);
  }, [isValid, setFormValid]);  

  useEffect(() => {
    let formChanged = false
    if (restaurant && restaurant.workingDays) {
      formChanged = !_.isEqual(restaurant.workingDays, watchedValues);
      setFormChanged(formChanged);
    } else {
      formChanged = !_.isEqual(defaultValues, watchedValues);
      setFormChanged(formChanged);
    }
  }, [watchedValues, setFormChanged, restaurant]);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <AppLayout>
      <Box p={2}>
        <form onSubmit={handleSubmit(handleWorkingDaysSubmit)}>
          <WorkingHoursCreator
            control={control}
            register={register}
            fields={fields}
            watchedValues={watchedValues}
            expanded={expanded}
            expandedChange={handleAccordionChange}
          />
          <Box
            sx={layoutClasses.stickyBottomBox}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <SaveButton
              type="submit"
              text = "Save"
              disabled={!formValid || !formChanged}
            />
          </Box>
          </form>
      </Box>
    </AppLayout>
  );
}

export default Hours;
