import { useEffect, useState } from 'react';

interface Printer {
  name: string;
  trays: string[];
  papers: string[];
}

interface PrinterSettingsProps {
  clientPrinters: Printer[];
  fileUrl: string;
  setFileUrl: (url: string) => void;
  fileSelected: File | null;
  setFileSelected: (file: File) => void;
  selectedPrinter: string;
  setSelectedPrinter: (printer: string) => void;
  selectedTray: string;
  setSelectedTray: (tray: string) => void;
  selectedPaper: string;
  setSelectedPaper: (paper: string) => void;
  printRotation: string;
  setPrintRotation: (rotation: string) => void;
}

const PrinterSettings: React.FC<PrinterSettingsProps> = ({
  clientPrinters,
  fileUrl,
  setFileUrl,
  fileSelected,
  setFileSelected,
  selectedPrinter,
  setSelectedPrinter,
  selectedTray,
  setSelectedTray,
  selectedPaper,
  setSelectedPaper,
  printRotation,
  setPrintRotation,
}) => {
  const [traysLoading, setTraysLoading] = useState(false)
  const [papersLoading, setPapersLoading] = useState(false)

  const showSelectedPrinterInfo = () => {
    const selectedPrinterObj = clientPrinters.find(printer => printer.name === selectedPrinter);
    if (selectedPrinterObj) {
      // setSelectedPrinterTrays(selectedPrinterObj.trays);
      setSelectedTray(selectedPrinterObj.trays.length > 0 ? selectedPrinterObj.trays[0] : "");
      setTraysLoading(false)
      // setSelectedPrinterPapers(selectedPrinterObj.papers);
      setSelectedPaper(selectedPrinterObj.papers.length > 0 ? selectedPrinterObj.papers[0] : "");
      setPapersLoading(false)
    }
  };

  useEffect(() => {
    setTraysLoading(true)
    setPapersLoading(true)
    showSelectedPrinterInfo();
  }, [selectedPrinter]);

  return (
    <div>
      <p>Selected file takes precedence over file url</p>
      <div>
        <label htmlFor="file">Select File:</label>
        <input
          type="file"
          name="file"
          id="file"
          accept=".pdf,.xls,.xlsx"
          onChange={(e) => setFileSelected(e.target.files?.[0] as File)}
        />
      </div>
      <div>
        <label htmlFor="txtFile">File URL (.pdf .xls .xlsx) :</label>
        <input
          type="text"
          name="txtFile"
          id="txtFile"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="lstPrinters">Printers:</label>
        <select
          name="lstPrinters"
          id="lstPrinters"
          value={selectedPrinter}
          onChange={(e) => setSelectedPrinter(e.target.value)}
        >
          {clientPrinters.map((printer, index) => (
            <option key={index} value={printer.name}>
              {printer.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="lstPrinterTrays">Supported Trays:</label>
        {traysLoading && <span>Loading...</span>}
          {!traysLoading && (

            <select
            name="lstPrinterTrays"
            id="lstPrinterTrays"
            value={selectedTray}
            onChange={(e) => setSelectedTray(e.target.value)}
            >
          {clientPrinters.find(printer => printer.name === selectedPrinter)?.trays.map((tray, index) => (
            <option key={index} value={tray}>
              {tray}
            </option>
          ))}
        </select>
        )}
      </div>
      <div>
        <label htmlFor="lstPrinterPapers">Supported Papers:</label>
        {papersLoading && <span>Loading...</span>}
        {!papersLoading && (
        <select
          name="lstPrinterPapers"
          id="lstPrinterPapers"
          value={selectedPaper}
          onChange={(e) => setSelectedPaper(e.target.value)}
        >
          {clientPrinters.find(printer => printer.name === selectedPrinter)?.papers.map((paper, index) => (
            <option key={index} value={paper}>
              {paper}
            </option>
          ))}
        </select>
        )}
      </div>
      <div>
        <label htmlFor="lstPrintRotation">Print Rotation (Clockwise):</label>
        <select
          name="lstPrintRotation"
          id="lstPrintRotation"
          value={printRotation}
          onChange={(e) => setPrintRotation(e.target.value)}
        >
          <option>None</option>
          <option>Rot90</option>
          <option>Rot180</option>
          <option>Rot270</option>
        </select>
      </div>
    </div>
  );
};

export default PrinterSettings;
