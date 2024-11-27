import TempChart from "@/components/TempChart";
import VerticalProgressBar from "@/components/VerticalProgressBar";
import HorizontalProgressBar from "@/components/HorizontalProgressBar";

const Dashboard = () => {
    const progress = 70;
    const radius = 80; // Reduced radius for larger margins

    const Temperature = 25;
    const Humidity = 50;
    const intensity = 100;

    return (
        <div>
            <div className="flex flex-col items-center justify-center py-8">
                <h1 className="text-3xl font-bold">Dashboard Page</h1>
                {/* Dashboard Content Real time data */}
                <TempChart progress={Temperature} radius={radius} strokeWidth={20} />
                <VerticalProgressBar 
                    progress={intensity}
                />
                <br />
                <HorizontalProgressBar 
                    progress={Humidity}
                />  
            </div>
        </div>
    )
};

export default Dashboard;