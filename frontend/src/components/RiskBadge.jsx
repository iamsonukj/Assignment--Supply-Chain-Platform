function RiskBadge({ risk }) {
const riskStyles = {
Low: "bg-green-100 text-green-700",
Medium: "bg-yellow-100 text-yellow-700",
High: "bg-red-100 text-red-700"
};

return (
<span
className={`px-4 py-1 rounded-full text-sm font-semibold ${
        riskStyles[risk] || "bg-gray-100 text-gray-700"
      }`}
>
{risk} </span>
);
}

export default RiskBadge;
