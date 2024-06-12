import { Button, Container } from '@mui/material';
import { PrintSettings } from './ComponentTypes';

interface IBlobPageProps {
    printersLoading: boolean;
    savedSettings: PrintSettings[];
}

const BlobPage = (props: IBlobPageProps) => {
    const handlePrintBlob = () => {
        console.log("Print Blob");
        // const settings: Settings = localStorage.getItem('blobPageSilentSettings') ? JSON.parse(localStorage.getItem('blobPageSilentSettings') || '') : {};

    }


  return(
    <Container
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 4,
        }}
    >
    <Button variant="contained" color="primary" onClick={handlePrintBlob}>
        Print Blob
    </Button>
    </Container>
  )
};

export default BlobPage;
