import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://blynk.cloud/external/api/get";
const AUTH_TOKEN = process.env.REACT_APP_BLYNK_AUTH_TOKEN;

// List of sensors with their corresponding virtual pins and units
const sensors = [
  { name: "Soil Moisture", pin: "V1", unit: "%" },
  { name: "Humidity", pin: "V2", unit: "%" },
  { name: "Temperature", pin: "V3", unit: "°C" },
  { name: "Light Intensity", pin: "V4", unit: "lux" },
  { name: "Air Quality", pin: "V5", unit: "" },
  { name: "Motion Detection", pin: "V6", unit: "" },
];

const Dashboard: React.FC = () => {
  const [sensorData, setSensorData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch data for all sensors
  const fetchSensorData = async () => {
    try {
      setError(null); // Clear previous errors
      const data: Record<string, string> = {};
      const promises = sensors.map((sensor) =>
        axios
          .get(`${API_URL}?token=${AUTH_TOKEN}&${sensor.pin}`)
          .then((response) => {
            data[sensor.name] = response.data;
          })
      );
      await Promise.all(promises); // Wait for all requests to complete
      setSensorData(data); // Update state with fetched data
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching sensor data:", err);
      setError("Failed to load sensor data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensorData(); // Fetch data initially

    // Set up real-time updates every 10 seconds
    const interval = setInterval(() => {
      fetchSensorData();
    }, 10000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-medium">Loading sensor data...</p>
      </div>
    );
  }

  // Show error message if data fetch fails
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100">
        <p className="text-lg font-medium text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Smart Farm Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensors.map((sensor) => (
          <div
            key={sensor.name}
            className="bg-white rounded shadow p-4 flex flex-col items-center"
          >
            <h2 className="text-lg font-medium">{sensor.name}</h2>
            <p className="text-4xl font-bold mt-2">
              {sensorData[sensor.name] || "N/A"} {sensor.unit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;