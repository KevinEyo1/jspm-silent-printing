import * as JSPM from 'jsprintmanager';
import { IExcelSettings, IPDFSettings, IPrinterSettings } from '../components/ComponentTypes';

// checks if JSPM Client App is downloaded and properly setup on client side
export const jspmWSStatus = () => {
  if (JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.Open) {
    return true;
  } else if (JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.Closed) {
    alert("JSPrintManager (JSPM) WebSocket is not open!\nIf you have installed JSPM, please restart it.");
    return false;
  } else if (JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.Blocked) {
    alert("JSPrintManager (JSPM) has blocked this website!");
    return false;
  }
};

export const checkFileType = (fileUrl: string) => {
  const fileExt = fileUrl.split('.').pop()?.toLowerCase();
  switch (fileExt) {
    case 'pdf':
      return 'PDF';
    case 'xls':
    case 'xlsx':
      return 'XLS';
    default:
      return 'unknown';
  }
}

export const createPDFFile = (data: string | Blob, dataSettings: IPDFSettings | undefined) => {
  const { printAnnotations, printAsGrayscale, printInReverseOrder, printRange, printRotation } = dataSettings as IPDFSettings;
  var pdfFile = undefined;
  if (data instanceof Blob) {
        pdfFile = new JSPM.PrintFilePDF(data, JSPM.FileSourceType.BLOB, 'apple.pdf', 1);
  } else if (typeof data === 'string') {
        pdfFile = new JSPM.PrintFilePDF(data, JSPM.FileSourceType.URL, 'apple.pdf', 1);
  } else {
    return undefined;
  }
  printAnnotations && (pdfFile.printAnnotations = printAnnotations);
  printAsGrayscale && (pdfFile.printAsGrayscale = printAsGrayscale);
  printInReverseOrder && (pdfFile.printInReverseOrder = printInReverseOrder);
  printRange && (pdfFile.printRange = printRange);
  printRotation && (pdfFile.printRotation = JSPM.PrintRotation[printRotation as keyof typeof JSPM.PrintRotation]);
  return pdfFile;
}

export const createExcelFile = (data: string | Blob, dataSettings: IExcelSettings | undefined) => {
  const { pageFrom, pageTo } = dataSettings as IExcelSettings;
  var xlsFile = undefined;
  if (data instanceof Blob) {
    xlsFile = new JSPM.PrintFileXLS(data, JSPM.FileSourceType.BLOB, 'apple.xls', 1);
  } else if (typeof data === 'string') {
    xlsFile = new JSPM.PrintFileXLS(data, JSPM.FileSourceType.URL, 'apple.xls', 1);
  } else {
    return undefined;
  }
  pageFrom && (xlsFile.pageFrom = pageFrom);
  pageTo && (xlsFile.pageTo = pageTo);
  return xlsFile;
}

const handlePrint = (data: string | Blob, dataFormat: string, printerSettings: IPrinterSettings, dataSettings: IPDFSettings | IExcelSettings | undefined) => {
  const { printerName, paperName, trayName } = printerSettings;
  const cpj = new JSPM.ClientPrintJob();
  const myPrinter = new JSPM.InstalledPrinter(printerName);
  paperName && (myPrinter.paperName = paperName);
  trayName && (myPrinter.trayName = trayName);
  cpj.clientPrinter = myPrinter;
  
  var printFile = undefined;
  switch(dataFormat) {
    case 'PDF':
    case 'application/pdf':
      printFile = createPDFFile(data, dataSettings as IPDFSettings | undefined);
      break;
    case 'XLS':
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      printFile = createExcelFile(data, dataSettings as IExcelSettings | undefined);
      break;
    default:
      alert('Invalid data input');
  }

  if (typeof printFile !== 'undefined') {
    cpj.files.push(printFile);
    cpj.sendToClient();
  } else {
    alert('Invalid data input')
  }
}
