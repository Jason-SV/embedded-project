// components/RealTimeSensorData.tsx
"use client";

import React, { useState, useEffect } from "react";
import getBlynkSensors from "@/libs/getBlynkSensors";

// Define the structure of the sensor data
interface SensorData {
  v1: number; // Temperature
  v2: number; // Humidity
  v3: number; // Intensity
  v4: number; // Air Quality
  v5: number; // Additional Sensor 5
  v6: number; // Additional Sensor 6
}

interface RealTimeSensorDataProps {
  onDataUpdate: (data: SensorData) => void;
  pollingInterval?: number; // in milliseconds
}

const RealTimeSensorData: React.FC<RealTimeSensorDataProps> = ({
  onDataUpdate,
  pollingInterval = 5000, // Default to 5 seconds
}) => {
  const [error, setError] = useState<string | null>(null);

  const fetchSensorData = async () => {
    try {
      const pins = ["v1", "v2", "v3", "v4", "v5", "v6"];
      const sensorPromises = pins.map((pin) => getBlynkSensors(pin));
      const sensorValues = await Promise.all(sensorPromises);
      const sensorData: SensorData = {
        v1: sensorValues[0],
        v2: sensorValues[1],
        v3: sensorValues[2],
        v4: sensorValues[3],
        v5: sensorValues[4],
        v6: sensorValues[5],
      };
      onDataUpdate(sensorData);
      setError(null); // Reset error on successful fetch
    } catch (err: any) {
      console.error("Error fetching sensor data:", err);
      setError(err.message || "Unknown error");
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchSensorData();

    // Set up polling
    const interval = setInterval(() => {
      fetchSensorData();
    }, pollingInterval);

    // Clean up on unmount
    return () => clearInterval(interval);
  }, [pollingInterval]);

  return (
    <div>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default RealTimeSensorData;