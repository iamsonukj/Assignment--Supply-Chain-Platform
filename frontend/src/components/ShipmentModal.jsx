function ShipmentModal({ shipment, onClose }) {
  if (!shipment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[500px] shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">
          Shipment Details
        </h2>

        <div className="space-y-3 text-gray-700">
          <p>
            <strong>Shipment ID:</strong>{" "}
            {shipment.shipment_id || "N/A"}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {shipment.delay_prediction || shipment.status || "N/A"}
          </p>

          <p>
            <strong>Carrier:</strong>{" "}
            {shipment.carrier_name || "N/A"}
          </p>

          <p>
            <strong>Origin:</strong>{" "}
            {shipment.origin_country || "N/A"}
          </p>

          <p>
            <strong>Destination:</strong>{" "}
            {shipment.destination_country || "N/A"}
          </p>

          <p>
            <strong>Shipment Mode:</strong>{" "}
            {shipment.shipment_mode || "N/A"}
          </p>

          <p>
            <strong>Cargo Category:</strong>{" "}
            {shipment.cargo_category || "N/A"}
          </p>

          <p>
            <strong>Weight:</strong>{" "}
            {shipment.weight_kg || "N/A"} kg
          </p>

          <p>
            <strong>Volume:</strong>{" "}
            {shipment.volume_cbm || "N/A"} cbm
          </p>

          <p>
            <strong>Declared Value:</strong> $
            {shipment.declared_value_usd || "N/A"}
          </p>

          <p>
            <strong>Delay Probability:</strong>{" "}
            {shipment.delay_probability
              ? `${(shipment.delay_probability * 100).toFixed(2)}%`
              : "N/A"}
          </p>

          <p>
            <strong>Estimated Delay Days:</strong>{" "}
            {shipment.estimated_delay_days || "N/A"}
          </p>

          <p>
            <strong>Risk Level:</strong>{" "}
            {shipment.risk_level || "N/A"}
          </p>

          <p>
            <strong>Route Risk Score:</strong>{" "}
            {shipment.route_risk_score || "N/A"}
          </p>

          <p>
            <strong>Carrier Flag:</strong>{" "}
            {shipment.carrier_anomaly_flag || "N/A"}
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ShipmentModal;