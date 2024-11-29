import TempChart from "@/components/TempChart";
import VerticalProgressBar from "@/components/VerticalProgressBar";
import HorizontalProgressBar from "@/components/HorizontalProgressBar";
import getBlynkSensors from "@/libs/getBlynkSensors";
// import RealTimeSensorData from "@/components/RealTimeSensorData";

interface SensorData {
    v1: number; // Temperature
    v2: number; // Humidity
    v3: number; // Intensity
    v4: number; // Air Quality
    v5: number; // Additional Sensor 5
    v6: number; // Additional Sensor 6
}


function normalizeData(value: number, previousValue: number, newRange: number, decimalPlaces: number = 1): number {
    const normalized = (value / previousValue) * newRange;
    return parseFloat(normalized.toFixed(decimalPlaces));
}

const Dashboard = async () => {
    let sensorData: SensorData;
    let error: string | null = null;

    try {
        const pins = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6'];
        const sensorPromises = pins.map(pin => getBlynkSensors(pin));
        const sensorValues = await Promise.all(sensorPromises);
        sensorData = {
            v1: sensorValues[0],
            v2: sensorValues[1],
            v3: sensorValues[2],
            v4: sensorValues[3],
            v5: sensorValues[4],
            v6: sensorValues[5],
        };
    } catch (err: any) {
        console.error("Error fetching sensor data:", err);
        sensorData = {
            v1: 0,
            v2: 0,
            v3: 0,
            v4: 0,
            v5: 0,
            v6: 0,
        };
        error = err.message || 'Unknown error';
    }

    const { v1: SoilMoister, v2: Humidity, v3: Temperature, v4: Intensity, v5: AirQuality, v6 } = sensorData;
    const radius = 70; // Reduced radius for larger margins
    const strokeWidth = 10;

    // // mock up
    // const Temperature = 25;
    // const Humidity = 50;
    // const intensity = 70;
    // const airQuality = 30;

    const unitTemp = "°C";
    const unitAirQuality = "ppm";
    const unitSoilMoisture = "wfv";
    const unitHumidity = "%";

    let Intensity_normal = normalizeData(Intensity, 4095, 100);
    let SoilMoister_normal = normalizeData(SoilMoister, 4095, 300);
    let AirQuality_normal = normalizeData(AirQuality, 4095, 300);
    
    return  (
        <div>
            <div className="grid grid-cols-2 grid-rows-3 gap-2 w-40 h-40 w-full h-[700px]">

                <div className="col-span-1 row-span-1 rounded-xl shadow-xl">
                    <div className="flex flex-col items-center justify-center h-full p-4 gap-4">
                        <TempChart 
                            progress={SoilMoister_normal}
                            radius={radius} 
                            strokeWidth={strokeWidth}
                            unit={unitSoilMoisture}
                            maxValue={300} />
                        <div className="text-center mt-3">
                            <p className="font-bold text-base">Soil Moisture</p>
                            <p className="text-sm">Soil Moisture</p>
                        </div>
                    </div>
                    
                </div>

                <div className="col-span-1 row-span-2 rounded-xl shadow-xl">
                    <div className="flex flex-col items-center justify-center h-full p-4 gap-4">
                        <VerticalProgressBar 
                            progress={Intensity_normal}
                            maxValue={100}
                        />
                        <div className="text-center">
                            <p className="font-bold text-base">LDR</p>
                            <p className="text-sm">Photoresistor</p>
                        </div>

                    </div>
                </div>

                <div className="col-span-1 row-span-1 rounded-xl shadow-xl">
                    <div className="flex flex-col items-center justify-center h-full p-4 gap-4">
                        <TempChart 
                            progress={AirQuality_normal} 
                            radius={radius} 
                            strokeWidth={strokeWidth}
                            unit={unitAirQuality}
                            maxValue={300} /> 
                        <div className="text-center mt-3">
                            <p className="font-bold text-base">MQ-135</p>
                            <p className="text-sm">Air Quality</p>
                        </div>
                    </div>
                </div>

                <div className="col-span-2 row-span-1 rounded-xl shadow-xl h-[100%]">
                    <div className="flex flex-col items-center justify-center h-full p-4 gap-4">
                        <HorizontalProgressBar 
                            progress={Humidity}
                            unitOfProgress={unitHumidity}
                        />
                        <div className="text-center mt-3">
                            
                            <p className="text-sm">Humidity</p>
                        </div>

                        <HorizontalProgressBar 
                            progress={Temperature}
                            unitOfProgress={unitTemp}
                        />
                        <div className="text-center mt-3">
                            <p className="text-sm">Temperature</p>
                        </div>
                        <p className="font-bold text-base">DHT22</p>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Dashboard;