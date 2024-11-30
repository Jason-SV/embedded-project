// import TempChart from "@/components/TempChart";
// import VerticalProgressBar from "@/components/VerticalProgressBar";
// import HorizontalProgressBar from "@/components/HorizontalProgressBar";
// // import RealTimeSensorData from "@/components/RealTimeSensorData";
// import getNetpieData from "@/libs/getNetpieData";

// interface NetpieData {
//     light: number;
//     humid: number;
//     temp: number;
//     soil: number;
//     air: number;
//     motion: number;
//   }
  
//   // Interface for the processed sensor data
//   interface SensorData {
//     SoilMoister: number;
//     Humidity: number;
//     Temperature: number;
//     Intensity: number;
//     AirQuality: number;
//     Motion: number;
//   }


// function normalizeData(value: number, previousValue: number, newRange: number, decimalPlaces: number = 1): number {
//     const normalized = (value / previousValue) * newRange;
//     return parseFloat(normalized.toFixed(decimalPlaces));
// }

// const Dashboard = async () => {

//     let sensorData: any = {}; // Store the sensor data
//     let error: string | null = null;
  
//     try {
//       // Fetch data from the Netpie API
//       const netpieData = await getNetpieData('de7beba1-0a57-4ab9-a049-cb8df3bfb050', 'owuak9Jonp7LNz9geqrNtWPM1Sgu8bDn');
//       console.log("Netpie data:", netpieData);
  
//       // Destructure the data object
//       const {
//         light,
//         humid,
//         temp,
//         soil,
//         air,
//         motion
//       } = netpieData.data;
  
//       // Normalize the data as needed
//       const SoilMoister_normal = normalizeData(soil, 4095, 300);  // Normalized soil moisture
//       const Humidity_normal = humid;  // Humidity is directly used
//       const Temperature_normal = temp;  // Temperature is directly used
//       const Intensity_normal = normalizeData(light, 4095, 100);  // Normalized light intensity
//       const AirQuality_normal = normalizeData(air, 4095, 300);  // Normalized air quality
  
//       // Return the data object with processed values
//       sensorData = {
//         SoilMoister: SoilMoister_normal,
//         Humidity: Humidity_normal,
//         Temperature: Temperature_normal,
//         Intensity: Intensity_normal,
//         AirQuality: AirQuality_normal,
//         Motion: motion,  // No need to normalize motion, you can use it as is
//       };
//     } catch (err: any) {
//       console.error("Error fetching Netpie data:", err);
//       error = err.message || 'Unknown error';
//       // Set default sensor values in case of error
//       sensorData = {
//         SoilMoister: 0,
//         Humidity: 0,
//         Temperature: 0,
//         Intensity: 0,
//         AirQuality: 0,
//         Motion: 0,
//       };
//     }
  
//     const { SoilMoister, Humidity, Temperature, Intensity, AirQuality, Motion } = sensorData;

//     const radius = 70; // Reduced radius for larger margins
//     const strokeWidth = 10;
  
//     const unitTemp = "°C";
//     const unitAirQuality = "ppm";
//     const unitSoilMoisture = "wfv";
//     const unitHumidity = "%";
  
//     console.log(`Soil Moisture: ${SoilMoister} ${unitSoilMoisture}`);
//     console.log(`Humidity: ${Humidity} ${unitHumidity}`);
//     console.log(`Temperature: ${Temperature} ${unitTemp}`);
//     console.log(`Light Intensity: ${Intensity}`);
//     console.log(`Air Quality: ${AirQuality} ${unitAirQuality}`);
//     console.log(`Motion: ${Motion}`);
    
//     return  (
//         <div>
//             <div className="grid grid-cols-2 grid-rows-3 gap-2 w-40 h-40 w-full h-[700px]">

//                 <div className="col-span-1 row-span-1 rounded-xl shadow-xl">
//                     <div className="flex flex-col items-center justify-center h-full p-4 gap-4">
//                         <TempChart 
//                             progress={SoilMoister}
//                             radius={radius} 
//                             strokeWidth={strokeWidth}
//                             unit={unitSoilMoisture}
//                             maxValue={300} />
//                         <div className="text-center mt-3">
//                             <p className="font-bold text-base">Soil Moisture</p>
//                             <p className="text-sm">Soil Moisture</p>
//                         </div>
//                     </div>
                    
//                 </div>

//                 <div className="col-span-1 row-span-2 rounded-xl shadow-xl">
//                     <div className="flex flex-col items-center justify-center h-full p-4 gap-4">
//                         <VerticalProgressBar 
//                             progress={Intensity}
//                             maxValue={100}
//                         />
//                         <div className="text-center">
//                             <p className="font-bold text-base">LDR</p>
//                             <p className="text-sm">Photoresistor</p>
//                         </div>

//                     </div>
//                 </div>

//                 <div className="col-span-1 row-span-1 rounded-xl shadow-xl">
//                     <div className="flex flex-col items-center justify-center h-full p-4 gap-4">
//                         <TempChart 
//                             progress={AirQuality} 
//                             radius={radius} 
//                             strokeWidth={strokeWidth}
//                             unit={unitAirQuality}
//                             maxValue={300} /> 
//                         <div className="text-center mt-3">
//                             <p className="font-bold text-base">MQ-135</p>
//                             <p className="text-sm">Air Quality</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="col-span-2 row-span-1 rounded-xl shadow-xl h-[100%]">
//                     <div className="flex flex-col items-center justify-center h-full p-4 gap-4">
//                         <HorizontalProgressBar 
//                             progress={Humidity}
//                             unitOfProgress={unitHumidity}
//                         />
//                         <div className="text-center mt-3">
                            
//                             <p className="text-sm">Humidity</p>
//                         </div>

//                         <HorizontalProgressBar 
//                             progress={Temperature}
//                             unitOfProgress={unitTemp}
//                         />
//                         <div className="text-center mt-3">
//                             <p className="text-sm">Temperature</p>
//                         </div>
//                         <p className="font-bold text-base">DHT22</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// };

// export default Dashboard;

// app/dashboard/page.tsx
import DashboardClient from "@/components/Dashboard"; // Client-side component
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

const Dashboard = async () => {
  // Fetch the initial data from Netpie API on the server
  const netpieData = await getNetpieData('de7beba1-0a57-4ab9-a049-cb8df3bfb050', 'owuak9Jonp7LNz9geqrNtWPM1Sgu8bDn');
  let {
    light, humid, temp, soil, air, motion
  } = netpieData.data;

const light_converted = 4095 - light;
console.log(`Converted Light Intensity: ${light_converted}`);
  
  const SoilMoister_normal = normalizeData(soil, 4095, 300);
  const Intensity_normal = normalizeData(light_converted, 4095, 100);
  const AirQuality_normal = normalizeData(air, 4095, 300);

  const initialData = {
    SoilMoister: SoilMoister_normal,
    Humidity: humid,
    Temperature: temp,
    Intensity: Intensity_normal,
    AirQuality: AirQuality_normal,
    Motion: motion,
  };

  return (
    <div>
      <DashboardClient initialData={initialData} />
    </div>
  );
};

export default Dashboard;
