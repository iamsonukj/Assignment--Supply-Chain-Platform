import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import ShipmentTable from "../components/ShipmentTable";
import FilterBar from "../components/FilterBar";
import ShipmentModal from "../components/ShipmentModal";

function ShipmentMonitor() {
  const [shipments, setShipments] = useState([]);
  const [status, setStatus] = useState("");
  const [carrier, setCarrier] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchShipments = useCallback(async () => {
    try {
      setLoading(true);

      const response = await API.get("/shipments", {
        params: {
          page,
          status,
          carrier,
          risk_level: riskLevel
        }
      });

      setShipments(response.data);
    } catch (error) {
      console.error("Error fetching shipments:", error);
    } finally {
      setLoading(false);
    }
  }, [page, status, carrier, riskLevel]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [status, carrier, riskLevel]);

  const handleRowClick = async (shipmentId) => {
    try {
      const response = await API.get(`/shipments/${shipmentId}`);
      setSelectedShipment(response.data);
    } catch (error) {
      console.error("Error fetching shipment detail:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Shipment Monitor
      </h1>

      <FilterBar
        status={status}
        carrier={carrier}
        riskLevel={riskLevel}
        setStatus={setStatus}
        setCarrier={setCarrier}
        setRiskLevel={setRiskLevel}
      />

      {loading ? (
        <div className="flex flex-col justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">
            Loading shipments...
          </p>
        </div>
      ) : (
        <>
          <ShipmentTable
            shipments={shipments}
            onRowClick={handleRowClick}
          />

          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() =>
                setPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={page === 1}
              className={`px-4 py-2 rounded ${
                page === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-500 text-white"
              }`}
            >
              Previous
            </button>

            <span className="px-4 py-2 font-semibold">
              Page {page}
            </span>

            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Next
            </button>
          </div>
        </>
      )}

      {selectedShipment && (
        <ShipmentModal
          shipment={selectedShipment}
          onClose={() => setSelectedShipment(null)}
        />
      )}
    </div>
  );
}

export default ShipmentMonitor;