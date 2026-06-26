function KpiCard({ title, value, color = "bg-white" }) {
  return (
    <div
      className={`
        ${color}
        p-6
        rounded-2xl
        shadow-md
        border border-gray-200
        transition-all duration-300
        hover:shadow-xl
        hover:-translate-y-1
      `}
    >
      <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
        {title}
      </h3>

      <p className="text-4xl font-bold text-gray-900 mt-4">
        {value}
      </p>
    </div>
  );
}

export default KpiCard;