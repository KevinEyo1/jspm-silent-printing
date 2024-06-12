interface PrintControlsProps {
  printRange: string;
  setPrintRange: (value: string) => void;
  printInReverseOrder: boolean;
  setPrintInReverseOrder: (value: boolean) => void;
  printAnnotations: boolean;
  setPrintAnnotations: (value: boolean) => void;
  printAsGrayscale: boolean;
  setPrintAsGrayscale: (value: boolean) => void;
}

const PrintControls: React.FC<PrintControlsProps> = ({
  printRange,
  setPrintRange,
  printInReverseOrder,
  setPrintInReverseOrder,
  printAnnotations,
  setPrintAnnotations,
  printAsGrayscale,
  setPrintAsGrayscale,
}) => {
  return (
    <div>
      <p>The below settings currently only apply to PDFs and not EXCELs.</p>
      <div>
        <label htmlFor="txtPrintRange">
          Pages Range (MUST BE IN RANGE): [e.g. 1,2,3,10-15]
        </label>
        <input
          type="text"
          id="txtPrintRange"
          value={printRange}
          onChange={(e) => setPrintRange(e.target.value)}
        />
      </div>
      <div>
        <label>
          <input
            id="chkPrintInReverseOrder"
            type="checkbox"
            checked={printInReverseOrder}
            onChange={(e) => setPrintInReverseOrder(e.target.checked)}
          />
          Print In Reverse Order?
        </label>
      </div>
      <div>
        <label>
          <input
            id="chkPrintAnnotations"
            type="checkbox"
            checked={printAnnotations}
            onChange={(e) => setPrintAnnotations(e.target.checked)}
          />
          Print Annotations?{' '}
          <span>
            <em>Windows Only</em>
          </span>
        </label>
      </div>
      <div>
        <label>
          <input
            id="chkPrintAsGrayscale"
            type="checkbox"
            checked={printAsGrayscale}
            onChange={(e) => setPrintAsGrayscale(e.target.checked)}
          />
          Print As Grayscale?{' '}
          <span>
            <em>Windows Only</em>
          </span>
        </label>
      </div>
    </div>
  );
};

export default PrintControls;
