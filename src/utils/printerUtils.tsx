import * as JSPM from 'jsprintmanager';
import * as XLSX from 'xlsx';

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

export const createFile = (file: string | Blob, fileType: string) => {
  if (file instanceof Blob) {
    switch(fileType) {
      case 'application/pdf':
        return new JSPM.PrintFilePDF(file, JSPM.FileSourceType.BLOB, 'apple.pdf', 1);
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return new JSPM.PrintFileXLS(file, JSPM.FileSourceType.BLOB, 'apple.xls', 1);
    }
  } else if (typeof file === 'string') {
    switch(fileType) {
      case 'PDF':
        return new JSPM.PrintFilePDF(file, JSPM.FileSourceType.URL, 'apple.pdf', 1);
      case 'XLS':
        return new JSPM.PrintFileXLS(file, JSPM.FileSourceType.URL, 'apple.xls', 1);
      default: // fileType unknown
        // remove 
        return new JSPM.PrintFilePDF(file, JSPM.FileSourceType.URL, 'apple.pdf', 1);
    }
  }
}
