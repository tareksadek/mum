import { Controller } from 'react-hook-form';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch,
  Typography,
  Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useWorkingDaysStyles } from './styles';

import DayShifts from './DayShifts';

interface WorkingHoursCreatorProps {
  control: any;
  register: any;
  fields: any;
  watchedValues: any;
  expanded: string | boolean;
  expandedChange: (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
}

const WorkingHoursCreator: React.FC<WorkingHoursCreatorProps> = ({ control, register, fields, watchedValues, expanded, expandedChange }) => {
  const classes = useWorkingDaysStyles()

  return (
    <Box>
      {fields.map((day: { id: string, dayName: string, active: boolean }, dayIndex: number) => (
        <Box pb={2} key={day.id}>
          <Accordion
            sx={classes.accordionContainer}
            expanded={expanded === day.id}
            onChange={(event, isExpanded) => expandedChange(day.id)(event, isExpanded)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={classes.accordionSummary}>
              <Controller
                name={`workingDays.${dayIndex}.active`}
                control={control}
                render={({ field: { onChange, onBlur, value, name, ref } }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        name={name}
                        inputRef={ref}
                        onClick={(event) => event.stopPropagation()}
                      />
                    }
                    label={
                      <Typography
                        variant="body1"
                        align="left"
                        onClick={(event) => event.stopPropagation()}
                        style={{ opacity: value ? '1' : '0.5' }}
                      >
                        {day.dayName}
                      </Typography>
                    }
                    labelPlacement="start"
                  />
                )}
              />
            </AccordionSummary>
            <AccordionDetails sx={classes.accordionDetails}>
              <DayShifts control={control} dayIndex={dayIndex} />
            </AccordionDetails>
          </Accordion>
        </Box>
      ))}
    </Box>
  );
};

export default WorkingHoursCreator;