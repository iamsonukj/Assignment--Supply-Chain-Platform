import { useState } from "react";
import API from "../services/api";
import RiskBadge from "../components/RiskBadge";

function PredictShipment() {
  const [formData, setFormData] = useState({
    origin_country: "",
    destination_country: "",
    carrier_name: "",
    shipment_mode: "",
    cargo_category: "",
    weight_kg: "",
    volume_cbm: "",
    declared_value_usd: "",
    customs_cleared: false
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);
    setLoading(true);

    try {
      const response = await API.post(
        "/shipments/predict",
        formData
      );

      setResult(response.data);
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Predict a Shipment
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 space-y-4"
      >
        <input
          type="text"
          name="origin_country"
          placeholder="Origin Country"
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="text"
          name="destination_country"
          placeholder="Destination Country"
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="text"
          name="carrier_name"
          placeholder="Carrier Name"
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="text"
          name="shipment_mode"
          placeholder="Shipment Mode"
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="text"
          name="cargo_category"
          placeholder="Cargo Category"
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="number"
          name="weight_kg"
          placeholder="Weight (kg)"
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="number"
          name="volume_cbm"
          placeholder="Volume (CBM)"
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="number"
          name="declared_value_usd"
          placeholder="Declared Value (USD)"
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="customs_cleared"
            onChange={handleChange}
          />
          Customs Cleared
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Predicting..." : "Predict Shipment"}
        </button>
      </form>

      {error && (
        <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-xl">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">
            Prediction Result
          </h2>

          <p>
            <strong>Delay Prediction:</strong>{" "}
            {result.delay_prediction}
          </p>

          <div className="mt-4">
            <p className="mb-2">
              <strong>Delay Probability:</strong>{" "}
              {(result.delay_probability * 100).toFixed(2)}%
            </p>

            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full"
                style={{
                  width: `${result.delay_probability * 100}%`
                }}
              ></div>
            </div>
          </div>

          <p className="mt-4">
            <strong>Estimated Delay Days:</strong>{" "}
            {result.estimated_delay_days}
          </p>

          <div className="mt-4">
            <strong>Risk Level:</strong>{" "}
            <RiskBadge risk={result.risk_level} />
          </div>
        </div>
      )}
    </div>
  );
}

export default PredictShipment;