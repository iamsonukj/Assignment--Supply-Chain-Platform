import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
);

function RouteRiskChart({ routes }) {
const chartData = {
labels: routes.map(
(route) =>
`${route.origin_country} → ${route.destination_country}`
),
datasets: [
{
label: "Risk Score",
data: routes.map(
(route) => route.route_risk_score
),
backgroundColor: "#3B82F6"
}
]
};

const options = {
responsive: true,
plugins: {
legend: {
display: false
}
}
};

return ( <div className="bg-white p-6 rounded-2xl shadow-md mt-6"> <h2 className="text-xl font-bold mb-4">
Top Risky Routes </h2>


  <Bar data={chartData} options={options} />
</div>


);
}

export default RouteRiskChart;
