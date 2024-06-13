export enum FileFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL'
}

export interface IPDFSettings {
  format: string;
  printRotation?: string;
  printRange?: string;
  printInReverseOrder?: boolean;
  printAnnotations?: boolean;
  printAsGrayscale?: boolean;
}

export interface IExcelSettings {
  format: string;
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

export type IFileSettings = IPDFSettings | IExcelSettings


export interface PrintSettings {
  printerSettings: IPrinterSettings;
  fileSettings: IFileSettings;
}

export interface SavedSettingsMap {
  [key: string]: PrintSettings;
}