import * as JSPM from 'jsprintmanager';
import { useState } from 'react';
import { IExcelSettings, IPDFSettings, IPrinter, IPrinterSettings, PrintSettings, SavedSettingsMap } from '../components/ComponentTypes';
import { checkFileType } from '../utils/printerUtils';
import PrintControls from './PrintControls';
import PrinterSettings from './PrinterSettings';
import './PrinterSetup.css';
import { handleSilentPrint } from '../utils/printerUtils';

type PrinterSetupProps = {
  clientPrinters: IPrinter[];
  selectedPrinterSettings: IPrinterSettings;
  setSelectedPrinterSettings: (settings: IPrinterSettings) => void;
  printersLoading: boolean;
  savedSettingsMap: SavedSettingsMap;
  setSavedSettingsMap: (settings: SavedSettingsMap) => void;
};

const PrinterSetup = (props: PrinterSetupProps) => {
  const {
    clientPrinters,
    selectedPrinterSettings,
    setSelectedPrinterSettings,
    printersLoading,
    savedSettingsMap,
    setSavedSettingsMap,
  } = props;
  const [fileUrl, setFileUrl] = useState<string>("https://neodynamic.com/temp/LoremIpsum.pdf");
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [selectedPDFSettings, setSelectedPDFSettings] = useState<IPDFSettings | undefined>(undefined);
  const [selectedExcelSettings, setSelectedExcelSettings] = useState<IExcelSettings | undefined>(undefined);
  const [fileFormatToSave, setFileFormatToSave] = useState<string>('PDF');
  const [nameToSave, setNameToSave] = useState<string>('');
 
 
  const handlePrint = (settings: undefined | PrintSettings) => {
    //test
    const proxyUrl = `http://localhost:3001/fetch-pdf?url=${encodeURIComponent(fileUrl)}`;
    
    const data = fileSelected ? fileSelected : proxyUrl;
    const dataFormat = fileSelected ? fileSelected.type : checkFileType(fileUrl);
    const settingsToUse = settings ? settings : {
      printerSettings: selectedPrinterSettings,
      fileSettings: fileFormatToSave === 'PDF' ? selectedPDFSettings : selectedExcelSettings,
    };

    handleSilentPrint(data, dataFormat, settingsToUse.printerSettings, settingsToUse.fileSettings);
  }


  const handleSaveSettings = () => {
    const newSetting: PrintSettings = {
      printerSettings: selectedPrinterSettings,
      fileSettings: fileFormatToSave === 'PDF' ? selectedPDFSettings : selectedExcelSettings,
    };
    const updatedSettings = { ...savedSettingsMap, [nameToSave]: newSetting};
    setSavedSettingsMap(updatedSettings);
    localStorage.setItem('savedSettingsMap', JSON.stringify(updatedSettings));
  };

  const handleUseSavedSetting = (setting: PrintSettings) => {
    handlePrint(setting);
  };

   const handleDeleteSavedSetting = (setting: SavedSetting) => {
   const updatedSettings = savedSettingsMap.filter((s) => s !== setting);
    setSavedSettingsMap(updatedSettings);
    localStorage.setItem('savedSettingsMap', JSON.stringify(updatedSettings));
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Advanced PDF Printing from Javascript</h1>
      <hr />
      {printersLoading && <p>Loading installed printers...</p>}
      {!printersLoading && clientPrinters.length === 0 && <p>No printers found!</p>}
      {!printersLoading && clientPrinters.length !== 0 && (
        <>
          <PrinterSettings
            clientPrinters={clientPrinters}
            fileUrl={fileUrl}
            setFileUrl={setFileUrl}
            fileSelected={fileSelected}
            setFileSelected={setFileSelected}
            selectedPrinter={selectedPrinter}
            setSelectedPrinter={setSelectedPrinter}
            selectedTray={selectedTray}
            setSelectedTray={setSelectedTray}
            selectedPaper={selectedPaper}
            setSelectedPaper={setSelectedPaper}
            printRotation={printRotation}
            setPrintRotation={setPrintRotation}
          />
          <PrintControls
            printRange={printRange}
            setPrintRange={setPrintRange}
            printInReverseOrder={printInReverseOrder}
            setPrintInReverseOrder={setPrintInReverseOrder}
            printAnnotations={printAnnotations}
            setPrintAnnotations={setPrintAnnotations}
            printAsGrayscale={printAsGrayscale}
            setPrintAsGrayscale={setPrintAsGrayscale}
          />
          <hr />
          <button type="button" onClick={() => handlePrint(undefined)}>Print Now</button>
          <button type="button" onClick={handleSaveSettings}>Save Settings</button>
          <h2>Saved Settings</h2>
          {savedSettingsMap.length === 0 && <p>No saved settings</p>}
          <div className="grid-container">
          {Object.keys(savedSettingsMap).map((key: string) => {
            const setting = savedSettingsMap[key];
            return (
              <div key={key} className="grid-item">
                <h3>{`Setting ${key}`}</h3>
                <p><strong>Printer:</strong> {setting.selectedPrinter}</p>
                <p><strong>Tray:</strong> {setting.selectedTray}</p>
                <p><strong>Paper:</strong> {setting.selectedPaper}</p>
                <p><strong>Print Rotation:</strong> {setting.printRotation}</p>
                <p><strong>Pages Range:</strong> {setting.printRange}</p>
                <p><strong>Print In Reverse Order:</strong> {setting.printInReverseOrder ? 'Yes' : 'No'}</p>
                <p><strong>Print Annotations:</strong> {setting.printAnnotations ? 'Yes' : 'No'}</p>
                <p><strong>Print As Grayscale:</strong> {setting.printAsGrayscale ? 'Yes' : 'No'}</p>
                <button type="button" onClick={() => handleUseSavedSetting(key)}>Silent Print</button>
                <button type="button" onClick={() => handleDeleteSavedSetting(key)}>Delete</button>
              </div>
            );
          })}
          </div>
        </>
      )}
    </div>
  );
};

export default PrinterSetup;
ete</button>
avedSetting(setting)}>Silent Print</button>
                <button type="button" onClick={() => handleDeleteSavedSetting(setting)}>Delete</button>
SavedSetting(setting)}>Silent Print</button>
                <button type="button" onClick={() => handleDeleteSavedSetting(setting)}>Delete</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PrinterSetup;
