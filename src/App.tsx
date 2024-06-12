import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import PrinterSetup from './components/PrinterSetup';
import PrinterSetupCopy from './components/PrinterSetupCopy';
import OtherPage from './components/HomePage';
import { useEffect, useState } from 'react';
import { Settings, IPrinter } from './components/ComponentTypes';
import * as JSPM from 'jsprintmanager';
import { jspmWSStatus } from './utils/printerUtils';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';

function App() {
  const [clientPrinters, setClientPrinters] = useState<IPrinter[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<string>("");
  const [printersLoading, setPrintersLoading] = useState(true);
  const [savedSettings, setSavedSettings] = useState<Settings[]>([]);

  useEffect(() => {
    // Load saved settings from local storage
    const saved = JSON.parse(localStorage.getItem('printerSettings') || '[]');
    setSavedSettings(saved);

    // WebSocket settings
    JSPM.JSPrintManager.auto_reconnect = true;
    JSPM.JSPrintManager.start();
    JSPM.JSPrintManager.WS!.onStatusChanged = () => {
      if (jspmWSStatus()) {
        // Get client installed printers
        function isObjectArray(value: unknown): value is IPrinter[] {
          return Array.isArray(value) && value.every(elem => typeof elem === 'object');
        }
        JSPM.JSPrintManager.getPrintersInfo(JSPM.PrintersInfoLevel.Basic, '', JSPM.PrinterIcon.None).then((printersList) => {
          if (isObjectArray(printersList)) {
            setClientPrinters(printersList);
            setSelectedPrinter(printersList.length > 0 ? printersList[0].name : "");
            setPrintersLoading(false);
          }
        });
      }
    };
  }, []);

  return (
    <Router>
      <AppBar position="fixed">
        <Toolbar>
        <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
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
          <Button color="inherit" component={Link} to="/other">
            Other
          </Button>
          <Button color="inherit" component={Link} to="/extra">
            Extra
          </Button>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<OtherPage />} />
        <Route path="/other" element={<PrinterSetup clientPrinters={clientPrinters} selectedPrinter={selectedPrinter} setSelectedPrinter={setSelectedPrinter} printersLoading={printersLoading} savedSettings={savedSettings} setSavedSettings={setSavedSettings} />} />
        <Route path="/extra" element={<PrinterSetupCopy clientPrinters={clientPrinters} selectedPrinter={selectedPrinter} setSelectedPrinter={setSelectedPrinter} printersLoading={printersLoading} savedSettings={savedSettings} setSavedSettings={setSavedSettings} />} />
      </Routes>
    </Router>
  );
}

export default App;
