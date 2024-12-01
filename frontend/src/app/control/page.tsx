import WaterPumpControl from "@/components/WaterPumpControl";

const Page = () => {
  return (
    <div>
      <div className="mx-2 opacity-100 font-poppins text-xl font-semibold leading-[30px] text-left decoration-skip-ink-none">
        Water pump control
      </div>
      
        <div className="relative w-full h-[300px]">
            <div className="relative z-10 ">
              <WaterPumpControl />
            </div>
        </div>
    </div>
  );
};

export default Page;