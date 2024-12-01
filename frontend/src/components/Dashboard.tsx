// components/Dashboard.tsx
"use client";

import React, { useState, useEffect } from 'react';
import TempChart from "@/components/TempChart";
import VerticalProgressBar from "@/components/VerticalProgressBar";
import HorizontalProgressBar from "@/components/HorizontalProgressBar";
import getNetpieData from "@/libs/getNetpieData";

interface SensorData {
  SoilMoister: number;
  Humidity: number;
  Temperature: number;
  Intensity: number;
  AirQuality: number;
  Motion: number;
}

function normalizeData(value: number, previousValue: number, newRange: number, decimalPlaces: number = 1): number {
  const normalized = (value / previousValue) * newRange;
  return parseFloat(normalized.toFixed(decimalPlaces));
}

const Dashboard = ({ initialData }: { initialData: SensorData }) => {
  const [sensorData, setSensorData] = useState<SensorData>(initialData);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const netpieData = await getNetpieData('de7beba1-0a57-4ab9-a049-cb8df3bfb050', 'owuak9Jonp7LNz9geqrNtWPM1Sgu8bDn');
        const {
          light, humid, temp, soil, air, motion
        } = netpieData.data;

        const SoilMoister_normal = normalizeData(soil, 4095, 300);
        const Intensity_normal = normalizeData(light, 4095, 100);
        const AirQuality_normal = normalizeData(air, 4095, 4095);

        setSensorData({
          SoilMoister: SoilMoister_normal,
          Humidity: humid,
          Temperature: temp,
          Intensity: Number((100 - Intensity_normal).toFixed(2)),
          AirQuality: AirQuality_normal,
          Motion: motion,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const { SoilMoister, Humidity, Temperature, Intensity, AirQuality, Motion } = sensorData;

  return (
    <div>
      <div className="grid grid-cols-2 grid-rows-3 gap-2 w-full h-[700px]">
        <div className="col-span-1 row-span-1 rounded-xl shadow-xl">
          <div className="flex flex-col items-center justify-center h-full p-4 gap-4">
            <TempChart progress={SoilMoister} radius={70} strokeWidth={10} unit="wfv" maxValue={300} />
            <div className="text-center mt-3">
              <p className="font-bold text-base">Soil Moisture</p>
              <p className="text-sm">Soil Moisture</p>
            </div>
          </div>
        </div>

        <div className="col-span-1 row-span-2 rounded-xl shadow-xl">
          <div className="flex flex-col items-center justify-center h-full p-4 gap-4">
            <VerticalProgressBar progress={Intensity} maxValue={100} />
            <div className="text-center">
              <p className="font-bold text-base">LDR</p>
              <p className="text-sm">Photoresistor</p>
            </div>
          </div>
        </div>

        <div className="col-span-1 row-span-1 rounded-xl shadow-xl">
          <div className="flex flex-col items-center justify-center h-full p-4 gap-4">
            <TempChart progress={AirQuality} radius={70} strokeWidth={10} unit="ppm" maxValue={300} />
            <div className="text-center mt-3">
              <p className="font-bold text-base">MQ-135</p>
              <p className="text-sm">Air Quality</p>
            </div>
          </div>
        </div>

        <div className="col-span-2 row-span-1 rounded-xl shadow-xl h-[100%]">
          <div className="flex flex-col items-center justify-center h-full p-4 gap-4">
            <HorizontalProgressBar progress={Humidity} unitOfProgress="%" />
            <div className="text-center mt-3">
              <p className="text-sm">Humidity</p>
            </div>

            <HorizontalProgressBar progress={Temperature} unitOfProgress="°C" />
            <div className="text-center mt-3">
              <p className="text-sm">Temperature</p>
            </div>
            <p className="font-bold text-base">DHT22</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;