import { useEffect, useState } from "react";
import API from "../services/api";
import KpiCard from "../components/KpiCard";
import ShipmentStatusChart from "../charts/ShipmentStatusChart";
import RouteRiskChart from "../charts/RouteRiskChart";

function Overview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await API.get("/dashboard/summary");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center mt-10 text-red-500">
        Failed to load dashboard data.
      </div>
    );
  }

  const delayedPercentage = (
    (data.total_delayed / data.total_shipments) * 100
  ).toFixed(2);

  const avgDelayDays =
    data.total_delayed > 0
      ? (
          data.top_5_risk_routes.reduce(
            (acc, route) => acc + route.route_risk_score,
            0
          ) / data.top_5_risk_routes.length
        ).toFixed(2)
      : 0;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Supply Chain Intelligence Platform
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard
          title="Total Shipments"
          value={data.total_shipments}
          color="bg-blue-50"
        />

        <KpiCard
          title="Total Delayed"
          value={`${data.total_delayed} (${delayedPercentage}%)`}
          color="bg-red-50"
        />

        <KpiCard
          title="In Transit"
          value={data.total_in_transit}
          color="bg-yellow-50"
        />

        <KpiCard
          title="Avg Delay Days"
          value={avgDelayDays}
          color="bg-green-50"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ShipmentStatusChart data={data} />
        <RouteRiskChart routes={data.top_5_risk_routes} />
      </div>
    </div>
  );
}

export default Overview;