import LogShow from "@/components/LogShow";

const History = () => {
    return (
        <div>   
            <div className="opacity-100 font-poppins text-xl font-semibold leading-[30px] text-left decoration-skip-ink-none">
                Camera Module (OV2640)
            </div>
            
            <div className="w-full h-[300px]">
                <LogShow />
            </div>

        </div>
    );
  };
  
export default History;