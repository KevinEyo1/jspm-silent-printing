import React, { useState } from 'react';
import { Box, Button, TextField, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Divider, Input } from '@mui/material';
import { DataSource } from './ComponentTypes';
import { set } from 'firebase/database';

interface DataSelectorProps {
    setDataSource: (dataSource: DataSource) => void;
};

type DataSelected = 'Blob' | 'Url';

const DataSelector: React.FC<DataSelectorProps> = ({ setDataSource }) => {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [blobName, setBlobName] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [dataSelected, setDataSelected] = useState<DataSelected>('Blob');
  const [error, setError] = useState<string>('');


  const handleChangeBlob = (event) => {
    if (!event.target.files) return;
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        setBlob(selectedFile);
        setBlobName(selectedFile.name);
        setDataSource(selectedFile);
        setError('');
    }
  };

  const handleChangeUrl = (event) => {
    const inputUrl = event.target.value;
    setUrl(inputUrl);
    setBlob(null);
    setError('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', height: '100px' }}>
            <Box sx={{flexGrow: '1'}}>
            <FormControl>
                <FormLabel id="data-source-form">Data Source</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="data-source-form"
                        name="data-source"
                        value={dataSelected}
                        onChange={(e) => setDataSelected(e.target.value as DataSelected)}
                    >
                        <FormControlLabel value="Blob" control={<Radio />} label="Blob" />
                        <FormControlLabel value="Url" control={<Radio />} label="Url" />
                    </RadioGroup>
            </FormControl>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{flexGrow: '1'}}>

            {dataSelected === 'Blob' && (
                <>
                <input
                    id='file-input'
                    type="file"
                    onChange={handleChangeBlob}
                    accept='.pdf,.xls,.xlsx'
                    style={{ display: 'none' }}
                />
                <label htmlFor="file-input">
                    <Button variant="contained" component="span">
                        Select File
                    </Button>
                </label>
                {blobName && <Typography paddingTop={"20px"}>{blobName}</Typography>}
                </>
            )}
            {dataSelected === 'Url' && (
                    <TextField
                        label="File URL (.pdf, .xls, .xlsx)"
                        variant="outlined"
                        fullWidth
                        value={url}
                        onChange={handleChangeUrl}
                        error={!!error}
                        helperText={error}
                    />
            )}
            </Box>
    </Box>
  );
};

export default DataSelector;
