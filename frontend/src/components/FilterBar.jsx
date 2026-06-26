function FilterBar({
status,
carrier,
riskLevel,
setStatus,
setCarrier,
setRiskLevel
}) {
return ( <div className="flex gap-4 mb-6">
<select
value={status}
onChange={(e) => setStatus(e.target.value)}
className="p-2 border rounded"
> <option value="">All Status</option> <option value="On Time">On Time</option> <option value="Delayed">Delayed</option> </select>


  <input
    type="text"
    placeholder="Carrier"
    value={carrier}
    onChange={(e) => setCarrier(e.target.value)}
    className="p-2 border rounded"
  />

  <select
    value={riskLevel}
    onChange={(e) => setRiskLevel(e.target.value)}
    className="p-2 border rounded"
  >
    <option value="">All Risk Levels</option>
    <option value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
  </select>
</div>


);
}

export default FilterBar;
