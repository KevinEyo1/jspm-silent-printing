import {
  AppBar,
  Button,
  Container,
  CssBaseline,
  Toolbar,
  Typography,
} from '@mui/material';
import * as JSPM from 'jsprintmanager';
import { useEffect, useState } from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import BlobPage from './components/BlobPage';
import {
  IPrinter,
  IPrinterSettings,
  SavedSettingsMap,
} from './components/ComponentTypes';
import HomePage from './components/HomePage';
import PrinterSetup from './components/PrinterSetup';
import UrlPage from './components/UrlPage';
import { jspmWSStatus } from './utils/printerUtils';

function App() {
  const [clientPrinters, setClientPrinters] = useState<IPrinter[]>([]);
  const [selectedPrinterSettings, setSelectedPrinterSettings] =
    useState<IPrinterSettings>({
      printerName: '',
      trayName: '',
      paperName: '',
    });
  const [printersLoading, setPrintersLoading] = useState(true);
  const [savedSettingsMap, setSavedSettingsMap] = useState<SavedSettingsMap>(
    {},
  );

  useEffect(() => {
    // Load saved settings from local storage
    const saved = localStorage.getItem('savedSettingsMap');
    if (saved) {
      setSavedSettingsMap(JSON.parse(saved));
    }

    function isObjectArray(value: unknown): value is IPrinter[] {
      return (
        Array.isArray(value) && value.every((elem) => typeof elem === 'object')
      );
    }

    // WebSocket settings
    JSPM.JSPrintManager.auto_reconnect = true;
    JSPM.JSPrintManager.start();

    JSPM.JSPrintManager.WS!.onStatusChanged = () => {
      if (jspmWSStatus()) {
        // Get client installed printers

        JSPM.JSPrintManager.getPrintersInfo(
          JSPM.PrintersInfoLevel.Basic,
          '',
          JSPM.PrinterIcon.None,
        ).then((printersList) => {
          if (isObjectArray(printersList)) {
            setClientPrinters(printersList);
            setSelectedPrinterSettings({
              printerName: printersList.length > 0 ? printersList[0].name : '',
              trayName: printersList.length > 0 ? printersList[0].trays[0] : '',
              paperName:
                printersList.length > 0 ? printersList[0].papers[0] : '',
            });
            setPrintersLoading(false);
          }
        });
      }
    };
  }, []);

  return (
    <>
      <Router>
        <CssBaseline />
        <AppBar position="fixed">
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              POC
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/settings">
              Settings
            </Button>
            <Button color="inherit" component={Link} to="/urlpage">
              URL Page
            </Button>
            <Button color="inherit" component={Link} to="/blobpage">
              Blob Page
            </Button>
          </Toolbar>
        </AppBar>
        <Toolbar />{' '}
        {/* This toolbar is a spacer to push content below the AppBar */}
        <Container>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/settings"
              element={
                <PrinterSetup
                  clientPrinters={clientPrinters}
                  selectedPrinterSettings={selectedPrinterSettings}
                  setSelectedPrinterSettings={setSelectedPrinterSettings}
                  printersLoading={printersLoading}
                  savedSettingsMap={savedSettingsMap}
                  setSavedSettingsMap={setSavedSettingsMap}
                />
              }
            />
            <Route path="/urlpage" element={<UrlPage />} />
            <Route
              path="/blobpage"
              element={
                <BlobPage
                  printersLoading={printersLoading}
                  savedSettingsMap={savedSettingsMap}
                />
              }
            />
          </Routes>
        </Container>
      </Router>
    </>
  );
}

export default App;
