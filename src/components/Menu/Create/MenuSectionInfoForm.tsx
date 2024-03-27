import React, { useState, useEffect } from 'react'
import { Controller } from 'react-hook-form';
import { Box, Switch, TextField, FormControlLabel, Tabs, Tab } from '@mui/material';
import { MenuSectionType } from '../../../types/menu';
import { ImageType } from '../../../types/restaurant';
import { coverImageDimensions } from '../../../setup/setup';
import CoverImageProcessor from '../../Restaurant/CoverImageProcessor';

interface MenuSectionInfoFormProps {
  sectionImageData: ImageType | null;
  setSectionImageData: React.Dispatch<React.SetStateAction<ImageType>>;
  section: MenuSectionType | null;
  control: any;
  register: any;
  errors: any;
  setValue: any;
  disableFields: boolean;
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
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `section-tab-${index}`,
    'aria-controls': `section-tabpanel-${index}`,
  };
}

const MenuSectionInfoForm: React.FC<MenuSectionInfoFormProps> = ({
  sectionImageData,
  setSectionImageData,
  section,
  control,
  errors,
  setValue,
  disableFields
}) => {
  const [tabValue, setTabValue] = useState(0);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (!disableFields) {
      setTabValue(newValue);
    }
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
                  label="Section Title*"
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
            <CoverImageProcessor
              data={sectionImageData}
              setData={setSectionImageData}
              cropWidth={coverImageDimensions.width}
              cropHeight={coverImageDimensions.height}
              parentModal="sectionDialog"
              createBase64={false}
            />
          )}
        </CustomTabPanel>
      </Box>
    </Box>
  );
}

export default MenuSectionInfoForm;
