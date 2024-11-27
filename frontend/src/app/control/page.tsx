import WaterPumpControl from "@/components/WaterPumpControl";

const Page = () => {
  return (
    <div>
      {/* WaterPump SVG Image at the lowest layer */}
      <img 
        src="/WaterPump.svg" 
        alt="Water Pump" 
        className="absolute top-[360px] left-[770px] w-300px h-200px z-0" 
      />

      {/* Fixed Frame with WaterPumpControl */}
      <div className="absolute top-[415px] left-[29px] w-[328px] h-[177px] rounded-tl-[20px] border-t border-transparent opacity-100 bg-white z-10">
        <WaterPumpControl />
      </div>

      {/* Text for Water Pump Control */}
      <div className="absolute top-[330px] left-[770px] w-[267px] h-[44px] opacity-100 font-poppins text-xl font-semibold leading-[30px] text-left decoration-skip-ink-none">
        Water pump control
      </div>
    </div>
  );
};

export default Page;
