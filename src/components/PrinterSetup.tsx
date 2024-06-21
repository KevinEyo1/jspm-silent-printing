import React, { useState, useEffect } from 'react';
import * as JSPM from 'jsprintmanager';
import PrinterSettings from './PrinterSettings';
import PrintControls from './PrintControls';
import { jspmWSStatus, checkFileType, createFile } from '../utils/printerUtils';
import './PrinterSetup.css';
import { set } from 'firebase/database';
import { data } from 'jquery';

interface Printer {
  name: string;
  trays: string[];
  papers: string[];
}

interface SavedSetting {
  selectedPrinter: string;
  selectedTray: string;
  selectedPaper: string;
  printRotation: string;
  pagesRange: string;
  printInReverseOrder: boolean;
  printAnnotations: boolean;
  printAsGrayscale: boolean;
}

const PrinterSetup = (props: any) => { 
  const { clientPrinters, selectedPrinter, setSelectedPrinter, printersLoading, savedSettings, setSavedSettings } = props;
  const [fileUrl, setFileUrl] = useState<string>("https://neodynamic.com/temp/LoremIpsum.pdf");
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [selectedTray, setSelectedTray] = useState<string>("");
  const [selectedPaper, setSelectedPaper] = useState<string>("");
  const [printRotation, setPrintRotation] = useState<string>("None");
  const [pagesRange, setPagesRange] = useState<string>("");
  const [printInReverseOrder, setPrintInReverseOrder] = useState(false);
  const [printAnnotations, setPrintAnnotations] = useState(false);
  const [printAsGrayscale, setPrintAsGrayscale] = useState(false);

  

  

  const handlePrint = (settings: undefined | SavedSetting) => {
    if (jspmWSStatus()) {
      // Create a ClientPrintJob
      const cpj = new JSPM.ClientPrintJob();
      const saved = settings !== undefined
      const myPrinter = new JSPM.InstalledPrinter(saved ? settings.selectedPrinter : selectedPrinter);
      myPrinter.paperName = saved ? settings.selectedPaper : selectedPaper;
      myPrinter.trayName = saved ? settings.selectedTray : selectedTray;
      cpj.clientPrinter = myPrinter;

      var my_file = null;
      console.log("fileSelected", fileSelected);
      // Set file
      if (fileSelected) {
        console.log("file selected path")
        my_file = createFile(fileSelected, fileSelected.type);
      } else {
        console.log("proxy path seldef4twea")
        const proxyUrl = `http://localhost:3001/fetch-pdf?url=${encodeURIComponent(fileUrl)}`;
        my_file = createFile(proxyUrl, checkFileType(fileUrl));
      }

      
      if (my_file instanceof JSPM.PrintFilePDF) {
        my_file.printRotation = JSPM.PrintRotation[(saved ? settings.printRotation : printRotation) as keyof typeof JSPM.PrintRotation];
        my_file.printRange = saved ? settings.pagesRange : pagesRange;
        my_file.printAnnotations = saved ? settings.printAnnotations : printAnnotations;
        my_file.printAsGrayscale = saved ? settings.printAsGrayscale : printAsGrayscale;
        my_file.printInReverseOrder = saved ? settings.printInReverseOrder : printInReverseOrder;
      } else if (my_file instanceof JSPM.PrintFileXLS) {
        alert('XLS file');
      }

      if (typeof my_file !== 'undefined') {
        console.log(my_file)
        cpj.files.push(my_file);
        cpj.onUpdated = (data: any) => {
          console.log(JSON.stringify(data));
        }
        cpj.onFinished = (data: any) => {
          console.log("finished" + JSON.stringify(data));
        }


        // Send print job to printer!
        cpj.sendToClient();

        alert('Print job sent to printer with settings chosen above!')
      } else {
        alert('Invalid data input')
      }
    }
  };

  const handleSaveSettings = () => {
    const newSetting: SavedSetting = {
      selectedPrinter,
      selectedTray,
      selectedPaper,
      printRotation,
      pagesRange,
      printInReverseOrder,
      printAnnotations,
      printAsGrayscale
    };
    const updatedSettings = [...savedSettings, newSetting];
    setSavedSettings(updatedSettings);
    localStorage.setItem('printerSettings', JSON.stringify(updatedSettings));
  };

  const handleUseSavedSetting = (setting: SavedSetting) => {
    handlePrint(setting);
  };

  const handleDeleteSavedSetting = (setting: SavedSetting) => {
    const updatedSettings = savedSettings.filter((s: any) => s !== setting);
    setSavedSettings(updatedSettings);
    localStorage.setItem('printerSettings', JSON.stringify(updatedSettings));
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
            pagesRange={pagesRange}
            setPagesRange={setPagesRange}
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
          {savedSettings.length === 0 && <p>No saved settings</p>}
          <div className="grid-container">
            {savedSettings.map((setting: any, index: any) => (
              <div key={index} className="grid-item">
                <h3>{`Setting ${index + 1}`}</h3>
                <p><strong>Printer:</strong> {setting.selectedPrinter}</p>
                <p><strong>Tray:</strong> {setting.selectedTray}</p>
                <p><strong>Paper:</strong> {setting.selectedPaper}</p>
                <p><strong>Print Rotation:</strong> {setting.printRotation}</p>
                <p><strong>Pages Range:</strong> {setting.pagesRange}</p>
                <p><strong>Print In Reverse Order:</strong> {setting.printInReverseOrder ? 'Yes' : 'No'}</p>
                <p><strong>Print Annotations:</strong> {setting.printAnnotations ? 'Yes' : 'No'}</p>
                <p><strong>Print As Grayscale:</strong> {setting.printAsGrayscale ? 'Yes' : 'No'}</p>
                <button type="button" onClick={() => handleUseSavedSetting(setting)}>Silent Print</button>
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
