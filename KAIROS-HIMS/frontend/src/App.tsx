import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReporterCreateIncidentPage from "./pages/ReporterCreateIncidentPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/report-incident"
          element={<ReporterCreateIncidentPage />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
