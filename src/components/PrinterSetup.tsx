import * as JSPM from 'jsprintmanager';
import { useState } from 'react';
import { IPrinter, IPrinterSettings, PrintSettings, SavedSettingsMap, FileFormat, IPDFSettings, IExcelSettings } from './ComponentTypes';
import { checkFileType } from '../utils/printerUtils';
import PrintControls from './PrintControls';
import PrinterSettings from './PrinterSettings';
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
  const [selectedPDFSettings, setSelectedPDFSettings] = useState<IPDFSettings>({ format: FileFormat.PDF});
  const [selectedExcelSettings, setSelectedExcelSettings] = useState<IExcelSettings>({ format: FileFormat.EXCEL});
  const [fileFormatToSave, setFileFormatToSave] = useState<string>(FileFormat.PDF);
  const [nameToSave, setNameToSave] = useState<string>('');
 
 
  const handlePrint = (settings: undefined | PrintSettings) => {
    //test
    const proxyUrl = `http://localhost:3001/fetch-pdf?url=${encodeURIComponent(fileUrl)}`;
    
    const data = fileSelected ? fileSelected : proxyUrl;
    const dataFormat = fileSelected ? fileSelected.type : checkFileType(fileUrl);
    const settingsToUse = settings ? settings : {
      printerSettings: selectedPrinterSettings,
      fileSettings: fileFormatToSave === FileFormat.PDF ? selectedPDFSettings : selectedExcelSettings,
    };

    handleSilentPrint(data, dataFormat, settingsToUse.printerSettings, settingsToUse.fileSettings);
  }


  const handleSaveSettings = () => {
    const newSetting: PrintSettings = {
      printerSettings: selectedPrinterSettings,
      fileSettings: fileFormatToSave === FileFormat.PDF ? selectedPDFSettings : selectedExcelSettings,
    };
    // const updatedSettings = { ...savedSettingsMap, [nameToSave]: newSetting};
    // setSavedSettingsMap(updatedSettings);
    setSavedSettingsMap({
      ...savedSettingsMap,
      [nameToSave]: newSetting,
    })
    localStorage.setItem('savedSettingsMap', JSON.stringify(savedSettingsMap));
  };

  const handleUseSavedSetting = (setting: PrintSettings) => {
    handlePrint(setting);
  };

  const handleDeleteSavedSetting = (name: string) => {
    const updatedSettings = { ...savedSettingsMap };
    delete updatedSettings[name];
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
            selectedPrinterSettings={selectedPrinterSettings}
            setSelectedPrinterSettings={setSelectedPrinterSettings}
            nameToSave={nameToSave}
            setNameToSave={setNameToSave}
          />
          <PrintControls
            selectedPDFSettings={selectedPDFSettings}
            setSelectedPDFSettings={setSelectedPDFSettings}
            selectedExcelSettings={selectedExcelSettings}
            setSelectedExcelSettings={setSelectedExcelSettings}
            fileFormatToSave={fileFormatToSave}
            setFileFormatToSave={setFileFormatToSave}
          />
          <hr />
          <button type="button" onClick={() => handlePrint(undefined)}>Print Now</button>
          <button type="button" onClick={handleSaveSettings}>Save Settings</button>
          <h2>Saved Settings</h2>
          {Object.keys(savedSettingsMap).length === 0 && <p>No saved settings found</p>}
          <div className="grid-container">
          {Object.keys(savedSettingsMap).map((key: string) => {
            const {printerSettings, fileSettings} = savedSettingsMap[key];
            return (
              <div key={key} className="grid-item">
                <h3>{`Setting for ${key}`}</h3>
                <p><strong>Printer:</strong> {printerSettings.printerName}</p>
                <p><strong>Tray:</strong> {printerSettings.trayName}</p>
                <p><strong>Paper:</strong> {printerSettings.paperName}</p>
                {'printRotation' in fileSettings && (
                  <>
                    <p><strong>PDF Settings</strong></p>
                    <p><strong>Print Rotation:</strong> {fileSettings.printRotation}</p>
                    <p><strong>Pages Range:</strong> {fileSettings.printRange}</p>
                    <p><strong>Print In Reverse Order:</strong> {fileSettings.printInReverseOrder ? 'Yes' : 'No'}</p>
                    <p><strong>Print Annotations:</strong> {fileSettings.printAnnotations ? 'Yes' : 'No'}</p>
                    <p><strong>Print As Grayscale:</strong> {fileSettings.printAsGrayscale ? 'Yes' : 'No'}</p>
                  </>
                )}
                {'pageFrom' in fileSettings && (
                  <>
                    <p><strong>Excel Settings</strong></p>
                    <p><strong>Page From:</strong> {fileSettings.pageFrom}</p>
                    <p><strong>Page To:</strong> {fileSettings.pageTo}</p>
                  </>
                )}
                <button type="button" onClick={() => handleUseSavedSetting(savedSettingsMap[key])}>Silent Print</button>
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
