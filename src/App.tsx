import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css'
import PrinterSetup from './components/PrinterSetup'
import OtherPage from './components/OtherPage';

function App() {

  return (
    <>
    {/* <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/other">Other</Link>
            </li>
            <li>
              <Link to="/extra">Extra</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<OtherPage />} />
          <Route path="/other" element={<PrinterSetup />} />
          <Route path="/extra" element={<PrinterSetup />} />
        </Routes>
      </div>
    </Router> */}
      <PrinterSetup />
      {/* <script type="text/javascript" src="JSPrintManager.js"></script> */}
      {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.5/bluebird.min.js"></script>
      <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>                       */}
    </>
  )
}

export default App

