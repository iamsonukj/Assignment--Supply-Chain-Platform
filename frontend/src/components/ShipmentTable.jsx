import RiskBadge from "./RiskBadge";

function ShipmentTable({ shipments, onRowClick }) {
const getRiskLevel = (score) => {
if (score < 15) return "Low";
if (score < 25) return "Medium";
return "High";
};

return ( <div className="bg-white shadow-md rounded-2xl overflow-hidden"> <table className="w-full text-left border-collapse"> <thead className="bg-gray-100 text-gray-700"> <tr> <th className="p-4">Shipment ID</th> <th className="p-4">Status</th> <th className="p-4">Delay Probability</th> <th className="p-4">Delay Days</th> <th className="p-4">Carrier Flag</th> <th className="p-4">Route Risk Score</th> <th className="p-4">Risk Level</th> </tr> </thead>


    <tbody>
      {shipments.length > 0 ? (
        shipments.map((shipment) => (
          <tr
            key={shipment.shipment_id}
            onClick={() => onRowClick(shipment.shipment_id)}
            className="border-t hover:bg-gray-50 transition cursor-pointer"
          >
            <td className="p-4">{shipment.shipment_id}</td>

            <td className="p-4">
              {shipment.delay_prediction === 1
                ? "Delayed"
                : "On Time"}
            </td>

            <td className="p-4">
              {(shipment.delay_probability * 100).toFixed(2)}%
            </td>

            <td className="p-4">
              {shipment.estimated_delay_days.toFixed(2)}
            </td>

            <td className="p-4">
              {shipment.carrier_anomaly_flag}
            </td>

            <td className="p-4">
              {shipment.route_risk_score}
            </td>

            <td className="p-4">
              <RiskBadge
                risk={getRiskLevel(shipment.route_risk_score)}
              />
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td
            colSpan="7"
            className="text-center p-6 text-gray-500"
          >
            No shipments found
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


);
}

export default ShipmentTable;
