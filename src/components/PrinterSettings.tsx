import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { IPrinter, IPrinterSettings } from './ComponentTypes';

interface PrinterSettingsProps {
  clientPrinters: IPrinter[];
  fileUrl: string;
  setFileUrl: (url: string) => void;
  fileSelected: File | null;
  setFileSelected: (file: File) => void;
  selectedPrinterSettings: IPrinterSettings;
  setSelectedPrinterSettings: (printer: IPrinterSettings) => void;
  nameToSave: string;
  setNameToSave: (name: string) => void;
}

const PrinterSettings: React.FC<PrinterSettingsProps> = ({
  clientPrinters,
  fileUrl,
  setFileUrl,
  fileSelected,
  setFileSelected,
  selectedPrinterSettings,
  setSelectedPrinterSettings,
  nameToSave,
  setNameToSave,
}) => {
  const [loading, setLoading] = useState(false);

  const showSelectedPrinterInfo = () => {
    const selectedPrinterObj = clientPrinters.find(
      (printer) => printer.name === selectedPrinterSettings.printerName,
    );
    if (selectedPrinterObj) {
      setSelectedPrinterSettings({
        ...selectedPrinterSettings,
        trayName: selectedPrinterObj.trays.length > 0 
        ? selectedPrinterObj.trays[0] : '',
        paperName: selectedPrinterObj.papers.length > 0
        ? selectedPrinterObj.papers[0] : '',
      })
      setLoading(false);
    } else {
      alert("Can't find printer");
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    showSelectedPrinterInfo();
  }, [selectedPrinterSettings.printerName]);

  const handleChange = (e: SelectChangeEvent<string>) => {
    const name = e.target.name as keyof IPrinterSettings;
    setSelectedPrinterSettings({
      ...selectedPrinterSettings,
      [name]: e.target.value as string,
    });
  }

  return (
    <Box>
      <Typography variant="h6">Selected file takes precedence over file URL</Typography>
      <Box mb={2}>
        <input
          type="file"
          accept=".pdf,.xls,.xlsx"
          onChange={(e) => setFileSelected(e.target.files?.[0] as File)}
        />
      </Box>
      <Box mb={2}>
        <TextField
          label="File URL (.pdf, .xls, .xlsx)"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          fullWidth
        />
      </Box>
      <Box mb={2}>
        <TextField
          label="Settings Name"
          value={nameToSave}
          onChange={(e) => setNameToSave(e.target.value)}
          fullWidth
        />
      </Box>
      <Box mb={2}>
        <FormControl fullWidth>
          <InputLabel id="printerName-label">Printers</InputLabel>
          <Select
            labelId="printerName-label"
            name="printerName"
            value={selectedPrinterSettings.printerName}
            onChange={handleChange}
          >
            {clientPrinters.map((printer, index) => (
              <MenuItem key={index} value={printer.name}>
                {printer.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl fullWidth>
          <InputLabel id="trayName-label">Supported Trays</InputLabel>
          {loading ? (
            <CircularProgress />
          ) : (
            <Select
              labelId="trayName-label"
              name="trayName"
              value={selectedPrinterSettings.trayName}
              onChange={handleChange}
            >
              {clientPrinters
                .find((printer) => printer.name === selectedPrinterSettings.printerName)
                ?.trays.map((tray, index) => (
                  <MenuItem key={index} value={tray}>
                    {tray}
                  </MenuItem>
                ))}
            </Select>
          )}
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl fullWidth>
          <InputLabel id="paperName-label">Supported Papers</InputLabel>
          {loading ? (
            <CircularProgress />
          ) : (
            <Select
              labelId="paperName-label"
              name="paperName"
              value={selectedPrinterSettings.paperName}
              onChange={handleChange}
            >
              {clientPrinters
                .find((printer) => printer.name === selectedPrinterSettings.printerName)
                ?.papers.map((paper, index) => (
                  <MenuItem key={index} value={paper}>
                    {paper}
                  </MenuItem>
                ))}
            </Select>
          )}
        </FormControl>
      </Box>
    </Box>
  );
};

export default PrinterSettings;
