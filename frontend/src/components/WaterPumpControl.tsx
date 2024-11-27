'use client';  // Add this line to mark the file as a Client Component

import { useState } from 'react';

const WaterPumpControl = () => {
    const [isOn, setIsOn] = useState(false);  // Toggle state for the "manual" button
    const [circleColor, setCircleColor] = useState('/lightRed.svg');  // Initial circle color

    const toggleSwitch = () => {
        setIsOn(!isOn);
        setCircleColor(!isOn ? '/lightRed.svg' : '/lightGreen.svg');  // Change circle color based on the button state
    };

    return (
        <div className="relative h-full p-2">
            {/* "PUMP Status" Text */}
            <div className="absolute bottom-10 left-[1000px] text-lg font-bold text-right">
            <div className="text-[#500E0E] text-left">PUMP</div>
            <div className="text-[#500E0E] text-left mt-[-7px]">Status: </div>
            </div>

            {/* Circle next to "PUMP Status" */}
            <div
            className="absolute bottom-11 right-[-780px] w-9 h-9 rounded-full"
            style={{ backgroundImage: `url(${circleColor})`, backgroundSize: 'cover' }}
            ></div>

            {/* Toggle Switch */}
            <label className="absolute bottom-[-50px] right-[-800px] inline-block w-[140px] h-[55px]">
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
                className={`absolute top-0 bottom-0 w-[70px] h-[55px] bg-[#ffffff] rounded-full transition-transform duration-300 transform
                    ${isOn ? 'translate-x-[70px]' : 'translate-x-0'} shadow-[2px_2px_12px_0px_#00000040]`}
                ></span>
                <span
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-xl font-bold
                    ${isOn ? 'text-black' : 'text-gray-500'}`}
                >
                ON
                </span>
                <span
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-xl font-bold
                    ${isOn ? 'text-gray-500' : 'text-black'}`}
                >
                OFF
                </span>
            </span>
            </label>

            {/* Manual Text */}
            <div className="absolute bottom-[-40px] right-[-490px] text-xl font-bold text-black">
                Manual
            </div>
        </div>
    );
};

export default WaterPumpControl;
