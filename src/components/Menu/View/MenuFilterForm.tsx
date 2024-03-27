import React, { useState, useContext, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { menuSelector } from '../../../store/selectors/menu';
import { closeModal } from '../../../store/reducers/modal';
import { useForm, Controller } from 'react-hook-form';
import { useRegisterSubmit, SubmitContext } from '../../../contexts/SubmitContext';
import { Box, TextField, FormControlLabel, Tabs, Tab, InputAdornment, Checkbox, FormGroup, FormLabel, Radio, RadioGroup, Grid, Slider, Typography } from '@mui/material';
import { MenuItemType } from '../../../types/menu';
import { dietaryRestrictions, dishTypes, spicinessLevels, servingTemperatures, portionSizes } from '../../../setup/setup';
import { useMenuItemStyles } from './styles'

interface MenuFilterFormProps {
  maxPrice: number | null;
  control: any;
  register: any;
  errors: any;
  setValue: any;
  disableFields: boolean;
  selectedPrice: string | null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ display: value === index ? 'block' : 'none' }}
    >
      <Box>
        {children}
      </Box>
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `item-tab-${index}`,
    'aria-controls': `item-tabpanel-${index}`,
  };
}

const MenuFilterForm: React.FC<MenuFilterFormProps> = ({
  maxPrice,
  control,
  register,
  errors,
  setValue,
  disableFields,
  selectedPrice
}) => {
  const classes = useMenuItemStyles()
  const { menu, menuId } = useSelector(menuSelector);

  const [tabValue, setTabValue] = useState(0);
  const [priceValue, setPriceValue] = useState(Number(selectedPrice) || maxPrice);
  
  const handleTabChange = async (event: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
  };

  const handlePriceSliderChange = (event: Event, newValue: number | number[]) => {
    setPriceValue(newValue as number);
    setValue('price', String(newValue));
  };

  const handlePriceInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPriceValue(event.target.value === '' ? 0 : Number(event.target.value));
  };

  const handlePriceInputBlur = () => {
    if (priceValue && priceValue < 0) {
      setPriceValue(0);
      setValue('price', '0');
    } else if (priceValue && maxPrice && priceValue > maxPrice) {
      setPriceValue(maxPrice);
      setValue('price', String(maxPrice));
    }
  };
  
  return (
    <Box>
      <Box>
        <Box mb={2}>
          <Tabs
            centered
            value={tabValue}
            onChange={handleTabChange}
            aria-label="create section tabs"
          >
            <Tab label="Price" {...a11yProps(0)} />
            <Tab label="Filters" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabValue} index={0}>
          <Box width="100%">
            <Typography id="price-slider" align='center' gutterBottom>
              Set max price
            </Typography>
            <Box display="flex" justifyContent="center" alignItems="center" width="100%" gap={2}>
              <Box width={200}>
                <Slider
                  value={typeof priceValue === 'number' ? priceValue : 0}
                  onChange={handlePriceSliderChange}
                  aria-labelledby="price-slider"
                  max={maxPrice || 100}
                />
              </Box>
              <Box width={100}>
                <Controller
                  name="price"
                  defaultValue={maxPrice}
                  control={control}
                  render={({ field: { ref, ...inputProps } }) => (
                    <TextField
                      label=""
                      inputRef={ref}
                      {...inputProps}
                      type="number"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      onChange={handlePriceInputChange}
                      onBlur={handlePriceInputBlur}
                      disabled={false}
                      error={Boolean(errors.price)}
                      helperText={errors.price?.message}
                      value={priceValue}
                      fullWidth
                    />
                  )}
                />
              </Box>
            </Box>
          </Box>
        </CustomTabPanel>

        <CustomTabPanel value={tabValue} index={1}>
          <Box pb={12} sx={classes.filterSectionsContainer}>
            <Box mt={1} pb={1}>
              <FormGroup>
                <FormLabel component="legend">Dietary Restrictions</FormLabel>
                <Box display="flex" alignItems="center" flexWrap="wrap" gap={0.5}>
                  {dietaryRestrictions.map((restriction) => (
                    <Box key={restriction.id} minWidth={100}>
                      <Controller
                        name="dietaryRestrictions"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={field.value.includes(restriction.id)}
                                onChange={(e) => {
                                  console.log(e)
                                  const newValues = e.target.checked
                                    ? [...field.value, restriction.id]
                                    : field.value.filter((id: string) => id !== restriction.id);
                                  field.onChange(newValues);
                                }}
                                disabled={disableFields}
                              />
                            }
                            label={restriction.name}
                            key={restriction.id}
                          />
                        )}
                      />
                    </Box>
                  ))}
                </Box>
              </FormGroup>
            </Box>

            <Box mt={2} pb={1}>
              <FormGroup>
                <FormLabel component="legend">Types</FormLabel>
                <Box display="flex" alignItems="center" flexWrap="wrap" gap={0.5}>
                  {dishTypes.map((type) => (
                    <Box key={type.id} minWidth={100}>
                      <Controller
                        name="types"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={field.value.includes(type.id)}
                                onChange={(e) => {
                                  const newValues = e.target.checked
                                    ? [...field.value, type.id]
                                    : field.value.filter((id: string) => id !== type.id);
                                  field.onChange(newValues);
                                }}
                                disabled={disableFields}
                              />
                            }
                            label={type.name}
                            key={type.id}
                          />
                        )}
                      />
                    </Box>
                  ))}
                </Box>
              </FormGroup>
            </Box>

            <Box mt={2} pb={1}>
              <FormGroup>
                <FormLabel component="legend">Spiciness Level</FormLabel>
                <Controller
                  name="spiciness"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      row
                      {...field}
                    >
                      {spicinessLevels.map((level) => (
                        <Box minWidth={100} key={level.id}>
                          <FormControlLabel
                            value={level.id}
                            control={<Radio disabled={disableFields} />}
                            label={level.name}
                          />
                        </Box>
                      ))}
                    </RadioGroup>
                  )}
                />
              </FormGroup>
            </Box>

            <Box mt={2} pb={1}>
              <FormGroup>
                <FormLabel component="legend">Serving Temperatures</FormLabel>
                <Controller
                  name="temperature"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      row
                      {...field}
                      sx={{ gap: 0.5 }}
                    >
                      {servingTemperatures.map((level) => (
                        <Box minWidth={100} key={level.id}>
                          <FormControlLabel
                            value={level.id}
                            control={<Radio disabled={disableFields} />}
                            label={level.name}
                          />
                        </Box>
                      ))}
                    </RadioGroup>
                  )}
                />
              </FormGroup>
            </Box>

            <Box mt={2}>
              <FormGroup>
                <FormLabel component="legend">Serving Size</FormLabel>
                <Controller
                  name="size"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      row
                      {...field}
                      sx={{ gap: 0.5 }}
                    >
                      {portionSizes.map((size) => (
                        <Box minWidth={100} key={size.id}>
                          <FormControlLabel
                            value={size.id}
                            control={<Radio disabled={disableFields} />}
                            label={size.name}
                          />
                        </Box>
                      ))}
                    </RadioGroup>
                  )}
                />
              </FormGroup>
            </Box>
          </Box>
        </CustomTabPanel>
      </Box>
    </Box>
  );
}

export default MenuFilterForm;
