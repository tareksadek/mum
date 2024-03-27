import React, { useState } from 'react'
import { Controller } from 'react-hook-form';
import { Box, Switch, TextField, FormControlLabel, Tabs, Tab, InputAdornment, Chip, Checkbox, FormGroup, FormLabel, Radio, RadioGroup } from '@mui/material';
import { MenuItemType } from '../../../types/menu';
import { ImageType } from '../../../types/restaurant';
import { profileImageDimensions } from '../../../setup/setup';
import ProfileImageProcessor from '../../Restaurant/ProfileImageProcessor';
import { dietaryRestrictions, dishTypes, spicinessLevels, servingTemperatures, portionSizes } from '../../../setup/setup';
import { useMenuItemStyles } from './styles'

interface MenuSectionInfoFormProps {
  itemImageData: ImageType | null;
  setItemImageData: React.Dispatch<React.SetStateAction<ImageType>>;
  item: MenuItemType | null;
  control: any;
  register: any;
  errors: any;
  setValue: any;
  disableFields: boolean;
  trigger: any;
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

const MenuItemInfoForm: React.FC<MenuSectionInfoFormProps> = ({
  itemImageData,
  setItemImageData,
  item,
  control,
  errors,
  setValue,
  disableFields,
  trigger
}) => {
  const classes = useMenuItemStyles()
  const [tabValue, setTabValue] = useState(0);
  
  const handleTabChange = async (event: React.SyntheticEvent, newValue: number) => {
    if (!disableFields) {
      setTabValue(newValue);
    }
  };

  const handleIngredientKeyDown = (field: { value: string[], onChange: (newValue: any) => void }) => (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Correctly access the input's value using event.target
      const target = event.target as HTMLInputElement; // Type assertion to HTMLInputElement
      const newIngredient = target.value.trim();
      if (newIngredient && !field.value.includes(newIngredient)) {
        const updatedIngredients = [...field.value, newIngredient];
        field.onChange(updatedIngredients); // Use field.onChange to update the field's value
        target.value = ''; // Clear the input field
      }
    }
  };
  
  const handleIngredientDelete = (index: number, ingredients: string[]) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    setValue('ingredients', updatedIngredients); // Directly use setValue to update the form state
  };  
  
  return (
    <Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        mb={2}
      >
        <Controller
          name="visible"
          control={control}
          defaultValue={true}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  onChange={e => {
                    setValue('visible', e.target.checked);
                    field.onChange(e.target.checked);
                  }}
                  disabled={disableFields}
                />
              }
              label="Active"
            />
          )}
        />
      </Box>

      <Box>
        <Box mb={2}>
          <Tabs
            centered
            value={tabValue}
            onChange={handleTabChange}
            aria-label="create section tabs"
          >
            <Tab label="Info" {...a11yProps(0)} />
            <Tab label="Image" {...a11yProps(1)} />
            <Tab label="Filters" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabValue} index={0}>
          <Box mb={1}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{
                required: "Title is required",
                validate: value => (value && value.length <= 39) || "Title must be 40 characters or less"
              }}
              render={({ field: { ref, ...inputProps } }) => (
                <TextField
                  label="Item Title*"
                  inputRef={ref}
                  {...inputProps}
                  inputProps={{
                    maxLength: 40
                  }}
                  disabled={disableFields}
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                  fullWidth
                />
              )}
            />
          </Box>

          <Box
            mt={2}
            mb={1}
            gap={1}
            display="flex"
            alignItems="center"
          >
            <Controller
              name="newPrice"
              control={control}
              defaultValue=""
              render={({ field: { ref, ...inputProps } }) => (
                <TextField
                  label="Current Price"
                  inputRef={ref}
                  {...inputProps}
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  disabled={disableFields}
                  error={Boolean(errors.originalPrice)}
                  helperText={errors.originalPrice?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="oldPrice"
              control={control}
              defaultValue=""
              render={({ field: { ref, ...inputProps } }) => (
                <TextField
                  label="Old Price"
                  inputRef={ref}
                  {...inputProps}
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  disabled={disableFields}
                  error={Boolean(errors.oldPrice)}
                  helperText={errors.oldPrice?.message}
                  fullWidth
                />
              )}
            />
          </Box>

          <Box mb={1} mt={2}>
            <Controller
              name="ingredients"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Box>
                  <TextField
                    label="Ingredients"
                    onKeyDown={handleIngredientKeyDown(field)}
                    disabled={disableFields}
                    helperText='Add an ingredient then press "Enter"'
                    fullWidth
                  />
                  <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                    {field.value.map((ingredient: string, index: number) => (
                      <Chip
                        key={index}
                        label={ingredient}
                        onDelete={() => handleIngredientDelete(index, field.value)}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            />
          </Box>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Controller
              name="description"
              control={control}
              defaultValue=""
              rules={{ maxLength: 120 }}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Description"
                  multiline
                  rows={6}
                  helperText={errors.description ? "Description must not exceed 120 characters." : `${field.value ? field.value.length : '0'}/120`}
                  error={Boolean(errors.description)}
                  disabled={disableFields}
                />
              )}
            />
          </Box>
        </CustomTabPanel>
        
        <CustomTabPanel value={tabValue} index={1}>
          {!disableFields && (
            <ProfileImageProcessor
              data={itemImageData}
              setData={setItemImageData}
              cropWidth={profileImageDimensions.width}
              cropHeight={profileImageDimensions.height}
              parentModal="itemDialog"
              createBase64={false}
            />
          )}
        </CustomTabPanel>

        <CustomTabPanel value={tabValue} index={2}>
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

export default MenuItemInfoForm;
