import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Tooltip,
Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Tooltip,
Legend
);

function ShipmentStatusChart({ data }) {
const chartData = {
labels: ["Delayed", "In Transit", "Delivered"],
datasets: [
{
label: "Shipment Count",
data: [
data.total_delayed,
data.total_in_transit,
data.total_delivered
],
backgroundColor: [
"#EF4444",
"#F59E0B",
"#10B981"
]
}
]
};

const options = {
responsive: true,
maintainAspectRatio: false
};

return ( <div className="bg-white p-6 rounded-2xl shadow-md"> <h2 className="text-xl font-bold mb-4">
Shipment Status Distribution </h2>


  <div className="h-72">
    <Bar data={chartData} options={options} />
  </div>
</div>


);
}

export default ShipmentStatusChart;
