import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Overview from "./pages/Overview";
import ShipmentMonitor from "./pages/ShipmentMonitor";
import PredictShipment from "./pages/PredictShipment";
import Intelligence from "./pages/Intelligence";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-100">

        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/shipments" element={<ShipmentMonitor />} />
            <Route path="/predict" element={<PredictShipment />} />
            <Route path="/intelligence" element={<Intelligence />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 text-center py-4 text-sm">
          Made with ❤️ by{" "}
          <span className="font-semibold text-white">
            Sonu Kumar
          </span>
        </footer>

      </div>
    </Router>
  );
}

export default App;