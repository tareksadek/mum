import React from 'react';
import { useForm, useFieldArray, Controller, Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch,
  TextField,
  MenuItem,
  Box,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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

interface WorkingHour {
  from: string;
  to: string;
}

interface WorkingDay {
  active: boolean;
  dayName: string;
  workingHours: WorkingHour[];
}

interface FormValues {
  workingDays: WorkingDay[];
}

// Define a type for the props expected by the function that adds/removes working hours
interface WorkingHourActionProps {
  control: Control<FormValues>;
  dayIndex: number;
  setValue: UseFormSetValue<FormValues>;
  watch: UseFormWatch<FormValues>;
}

interface DayShiftsProps {
  control: Control<FormValues>; // Assuming FormValues is your form's type
  dayIndex: number;
}

const WorkingHoursCreator = () => {
  const { control, handleSubmit, register } = useForm({
    defaultValues: {
      workingDays: dayNames.map(dayName => ({
        active: false,
        dayName,
        workingHours: [{ from: '', to: '' }],
      })),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "workingDays",
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((day, dayIndex) => (
        <Accordion key={day.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <FormControlLabel
              control={<Switch {...register(`workingDays.${dayIndex}.active`)} onClick={(event) => event.stopPropagation()} />}
              label={day.dayName}
              labelPlacement="start"
            />
          </AccordionSummary>
          <AccordionDetails>
            <DayShifts control={control} dayIndex={dayIndex} />
          </AccordionDetails>
        </Accordion>
      ))}
      <Button type="submit" variant="contained">Submit</Button>
    </form>
  );
};

const DayShifts: React.FC<DayShiftsProps> = ({ control, dayIndex }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `workingDays.${dayIndex}.workingHours`,
  });

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
            <Button onClick={() => remove(shiftIndex)}>Remove Shift</Button>
          )}
        </Box>
      ))}
      <Button onClick={() => append({ from: '', to: '' })}>Add Shift</Button>
    </Box>
  );
};

export default WorkingHoursCreator;