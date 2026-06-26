import { useEffect, useState } from "react";
import API from "../services/api";

function Intelligence() {
  const [carriers, setCarriers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [carrierResponse, routeResponse] =
        await Promise.all([
          API.get("/carriers/anomalies"),
          API.get("/routes/risk")
        ]);

      setCarriers(carrierResponse.data);
      setRoutes(routeResponse.data);
    } catch (error) {
      console.error("Error fetching intelligence data:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortRoutes = () => {
    const sortedRoutes = [...routes].sort((a, b) =>
      sortOrder === "asc"
        ? a.route_risk_score - b.route_risk_score
        : b.route_risk_score - a.route_risk_score
    );

    setRoutes(sortedRoutes);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">
          Loading intelligence data...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10">

      {/* Carrier Intelligence */}
      <div>
        <h1 className="text-3xl font-bold mb-6">
          Carrier Intelligence
        </h1>

        <div className="bg-white shadow-md rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Carrier Name</th>
                <th className="p-4">Anomaly Flag</th>
                <th className="p-4">Delay Rate</th>
                <th className="p-4">Average Delay Days</th>
              </tr>
            </thead>

            <tbody>
              {carriers.map((carrier, index) => (
                <tr
                  key={index}
                  className={
                    carrier.anomaly_flag === "Anomalous"
                      ? "bg-red-100 border-t"
                      : "border-t"
                  }
                >
                  <td className="p-4">{carrier.carrier_name}</td>
                  <td className="p-4">{carrier.anomaly_flag}</td>
                  <td className="p-4">
                    {carrier.delay_rate_percent
                      ? `${carrier.delay_rate_percent.toFixed(2)}%`
                      : "N/A"}
                  </td>
                  <td className="p-4">
                    {carrier.average_delay_days?.toFixed(2) || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Route Intelligence */}
      <div>
        <h1 className="text-3xl font-bold mb-6">
          Route Intelligence
        </h1>

        <div className="bg-white shadow-md rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Origin</th>
                <th className="p-4">Destination</th>

                <th
                  className="p-4 cursor-pointer text-blue-600"
                  onClick={sortRoutes}
                >
                  Risk Score {sortOrder === "asc" ? "↑" : "↓"}
                </th>

                <th className="p-4">Delay Rate</th>
                <th className="p-4">Customs Hold Rate</th>
              </tr>
            </thead>

            <tbody>
              {routes.map((route, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4">{route.origin_country}</td>
                  <td className="p-4">{route.destination_country}</td>

                  <td className="p-4">
                    {route.route_risk_score?.toFixed(2) || "N/A"}
                  </td>

                  <td className="p-4">
                    {route.historical_delay_rate_percent
                      ? `${route.historical_delay_rate_percent.toFixed(2)}%`
                      : "N/A"}
                  </td>

                  <td className="p-4">
                    {route.customs_hold_rate_percent
                      ? `${route.customs_hold_rate_percent.toFixed(2)}%`
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Intelligence;