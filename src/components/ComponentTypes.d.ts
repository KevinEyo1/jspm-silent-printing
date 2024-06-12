export interface IPDFSettings {
    printRotation?: string;
    printRange?: string;
    printInReverseOrder?: boolean;
    printAnnotations?: boolean;
    printAsGrayscale?: boolean;
  }

export interface IExcelSettings {
  pageFrom?: number;
  pageTo?: number;
}

export interface IPrinterSettings {
  printerName: string;
  paperName: string
  trayName?: string;
}

  export interface IPrinter {
    name: string;
    trays: string[];
    papers: string[];
  }