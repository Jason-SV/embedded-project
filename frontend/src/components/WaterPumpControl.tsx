'use client';  // Add this line to mark the file as a Client Component

import { useState } from 'react';
import Image from 'next/image';

const WaterPumpControl = () => {
    const [isOn, setIsOn] = useState(false);  // Toggle state for the "manual" button
    const [circleColor, setCircleColor] = useState('/lightRed.svg');  // Initial circle color

    const toggleSwitch = () => {
        setIsOn(!isOn);
        setCircleColor(!isOn ? '/lightRed.svg' : '/lightGreen.svg');  // Change circle color based on the button state
    };

    return (
        <div className="relative h-full py-5">
            <div className='w-full h-[200px] rounded-xl shadow-2xl relative'>
                <Image
                    src="/PumpCrop.png"
                    alt="Lightbulb"
                    width={200}
                    height={70}
                    objectFit="contain"
                    layout="fixed"
                    className='absolute z-0 left-10'
                />
                <div className='flex justify-end gap-4 absolute bottom-4 right-4'>
                    <div className="text-lg font-bold text-right">
                        <div className="text-[#500E0E] text-left">PUMP Status:</div>
                    </div>
                    <div
                        className=" w-9 h-9 rounded-full"
                        style={{ backgroundImage: `url(${circleColor})`, backgroundSize: 'cover' }}
                    ></div>
                </div>
            </div>
            
            <div className='flex flex-row justify-between mt-10'>

                <div className="text-xl font-bold text-black">
                    Manual
                </div>
                <div className="relative w-[100px]">
                    <label className="absolute w-[100px] h-[40px]">
                        <input
                            type="checkbox"
                            checked={isOn}
                            onChange={toggleSwitch}
                            className="opacity-0 w-0 h-0"
                        />
                        <span
                            className={`absolute top-0 left-0 right-0 bottom-0 transition-colors duration-300 rounded-full 
                            ${isOn ? 'bg-[#E0DFFE]' : 'bg-[#E0DFFE]'}
                            `}
                        >
                            <span
                                className={`absolute top-0 bottom-0 w-[50px] h-[40px] bg-[#ffffff] rounded-full transition-transform duration-300 transform
                                    ${isOn ? 'translate-x-[50px]' : 'translate-x-0'} shadow-[2px_2px_8px_0px_#00000040]`}
                            ></span>
                            <span
                                className={`absolute left-2 top-1/2 transform -translate-y-1/2 text-sm font-bold
                                    ${isOn ? 'text-black' : 'text-gray-500'}`}
                            >
                                ON
                            </span>
                            <span
                                className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-bold
                                    ${isOn ? 'text-gray-500' : 'text-black'}`}
                            >
                                OFF
                            </span>
                        </span>
                    </label>
                </div>

            </div>
        </div>
    );
};

export default WaterPumpControl;
