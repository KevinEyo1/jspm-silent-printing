import React from 'react';
import {
  AppBar,
  Tabs,
  Tab,
  TextField,
  Box,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { FileFormat, IExcelSettings, IPDFSettings } from './ComponentTypes';

interface PrintControlsProps {
  selectedPDFSettings: IPDFSettings;
  setSelectedPDFSettings: (settings: IPDFSettings) => void;
  selectedExcelSettings: IExcelSettings;
  setSelectedExcelSettings: (settings: IExcelSettings) => void;
  fileFormatToSave: string;
  setFileFormatToSave: (format: string) => void;
}

const PrintControls: React.FC<PrintControlsProps> = ({
  selectedPDFSettings,
  setSelectedPDFSettings,
  selectedExcelSettings,
  setSelectedExcelSettings,
  fileFormatToSave,
  setFileFormatToSave,
}) => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
    setFileFormatToSave(newValue === 0 ? FileFormat.PDF : FileFormat.EXCEL);
  };

  const handlePDFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPDFSettings({
      ...selectedPDFSettings,
      [e.target.name]: e.target.value,
    });
  };

  const handleExcelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedExcelSettings({
      ...selectedExcelSettings,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box>
      <AppBar position="static">
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="PDF" />
          <Tab label="Excel" />
        </Tabs>
      </AppBar>
      <Box p={3}>
        {tabValue === 0 && (
          <Box>
            <TextField
              label="Print Rotation"
              name="printRotation"
              value={selectedPDFSettings.printRotation || ''}
              onChange={handlePDFChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Pages Range"
              name="printRange"
              value={selectedPDFSettings.printRange || ''}
              onChange={handlePDFChange}
              fullWidth
              margin="normal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="printInReverseOrder"
                  checked={selectedPDFSettings.printInReverseOrder || false}
                  onChange={handlePDFChange}
                />
              }
              label="Print In Reverse Order"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="printAnnotations"
                  checked={selectedPDFSettings.printAnnotations || false}
                  onChange={handlePDFChange}
                />
              }
              label="Print Annotations"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="printAsGrayscale"
                  checked={selectedPDFSettings.printAsGrayscale || false}
                  onChange={handlePDFChange}
                />
              }
              label="Print As Grayscale"
            />
          </Box>
        )}
        {tabValue === 1 && (
          <Box>
            <TextField
              label="Page From"
              name="pageFrom"
              value={selectedExcelSettings.pageFrom || ''}
              onChange={handleExcelChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Page To"
              name="pageTo"
              value={selectedExcelSettings.pageTo || ''}
              onChange={handleExcelChange}
              fullWidth
              margin="normal"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PrintControls;
