import { useFieldArray, Controller, Control } from 'react-hook-form';
import {
  TextField,
  Box,
  Button,
  IconButton,
  MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { WorkingDaysForm } from '../../types/restaurant';

interface DayShiftsProps {
  control: Control<WorkingDaysForm>;
  dayIndex: number;
}

const DayShifts: React.FC<DayShiftsProps> = ({ control, dayIndex }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `workingDays.${dayIndex}.workingHours`,
  });

// 24h
// const generateTimeOptions = () => {
//   const times = [];
//   for (let hour = 0; hour < 24; hour++) {
//     for (let minute = 0; minute < 60; minute += 30) {
//       const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
//       times.push(<MenuItem key={time} value={time}>{time}</MenuItem>);
//     }
//   }
//   return times;
// };
//AM PM

const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      // Convert 24-hour time to 12-hour format with AM/PM
      const hour12 = hour % 12 === 0 ? 12 : hour % 12;
      const amPm = hour < 12 ? 'AM' : 'PM';
      const timeFormatted = `${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${amPm}`;
      
      times.push(<MenuItem key={timeFormatted} value={timeFormatted}>{timeFormatted}</MenuItem>);
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {fields.map((shift, shiftIndex) => (
        <Box key={shift.id} sx={{ display: 'flex', gap: 2 }}>
          <Controller
            name={`workingDays.${dayIndex}.workingHours.${shiftIndex}.from`}
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="From" fullWidth variant="outlined">
                {timeOptions}
              </TextField>
            )}
          />
          <Controller
            name={`workingDays.${dayIndex}.workingHours.${shiftIndex}.to`}
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="To" fullWidth variant="outlined">
                {timeOptions}
              </TextField>
            )}
          />
          {shiftIndex > 0 && (
            <IconButton
              onClick={() => remove(shiftIndex)}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      ))}
      <Button
        onClick={() => append({ from: '', to: '' })}
        variant="outlined"
        color="secondary"
        fullWidth
      >
        Add Shift
      </Button>
    </Box>
  );
};

export default DayShifts;