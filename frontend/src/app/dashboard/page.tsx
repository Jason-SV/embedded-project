import TempChart from "@/components/TempChart";
import VerticalProgressBar from "@/components/VerticalProgressBar";
import HorizontalProgressBar from "@/components/HorizontalProgressBar";

const Dashboard = () => {
    const progress = 60;
    const radius = 70; // Reduced radius for larger margins
    const strokeWidth = 10;

    const Temperature = 25;
    const Humidity = 50;
    const intensity = 70;
    const airQuality = 30;

    const unitTemp = "°C";
    const unitAirQuality = "ppm";

    return (
        <div>
            <div className="grid grid-cols-2 grid-rows-3 gap-2 w-40 h-40 w-full h-[700px]">

                <div className="col-span-1 row-span-1 rounded-xl shadow-xl">
                    <div className="flex flex-col items-center justify-center h-full p-4 gap-4">
                        <TempChart 
                            progress={Temperature} 
                            radius={radius} 
                            strokeWidth={strokeWidth}
                            unit={unitTemp}
                            maxValue={100} />
                        <div className="text-center mt-3">
                            <p className="font-bold text-base">DHT22</p>
                            <p className="text-sm">Temperature</p>
                        </div>
                    </div>
                    
                </div>

                <div className="col-span-1 row-span-2 rounded-xl shadow-xl">
                    <div className="flex flex-col items-center justify-center h-full p-4 gap-4">
                        <VerticalProgressBar 
                            progress={intensity}
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
                            progress={airQuality} 
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

                <div className="col-span-2 row-span-1 rounded-xl shadow-xl h-[60%]">
                    <div className="flex flex-col items-center justify-center h-full p-4 gap-4">
                        <HorizontalProgressBar 
                            progress={Humidity}
                        />
                        <div className="text-center mt-3">
                            <p className="font-bold text-base">DHT22</p>
                            <p className="text-sm">Humidity</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Dashboard;