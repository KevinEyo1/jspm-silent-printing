interface IPDFSettings {
  printRotation?: string;
  printRange?: string;
  printInReverseOrder?: boolean;
  printAnnotations?: boolean;
  printAsGrayscale?: boolean;
}

interface IExcelSettings {
  pageFrom?: number;
  pageTo?: number;
}

export interface IPrinterSettings {
  printerName: string;
  trayName?: string;
  paperName: string;
}

export interface IPrinter {
  name: string;
  trays: string[];
  papers: string[];
}

export type IFileSettings = IPDFSettings | IExcelSettings | undefined


export interface PrintSettings {
  printerSettings: IPrinterSettings;
  fileSettings: IFileSettings;
}

export interface SavedSettingsMap {
  [key: string]: PrintSettings;
}