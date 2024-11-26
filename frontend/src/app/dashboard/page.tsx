import TempChart from "@/components/TempChart";

const Dashboard = () => {
    const progress = 70;
    const radius = 80; // Reduced radius for larger margins

    return (
        <div>
            <div className="flex flex-col items-center justify-center py-8">
                <h1 className="text-3xl font-bold">Dashboard Page</h1>
                {/* Dashboard Content Real time data */}
                <TempChart progress={progress} radius={radius} strokeWidth={20} />
            </div>
        </div>
    )
};

export default Dashboard;