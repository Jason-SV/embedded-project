// HorizontalProgressBar.tsx
import React from "react";

// Define prop types
interface HorizontalProgressBarProps {
  progress: number;
  width?: string; // Width of the progress bar (e.g., '300px', 'w-48')
  height?: string; // Height of the progress bar (e.g., '10px', 'h-6')
}

const HorizontalProgressBar: React.FC<HorizontalProgressBarProps> = ({
  progress,
  width = "300px",
  height = "10px",
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div
      className="relative rounded-3xl bg-gray-200 overflow-visible shadow-[0_10px_40px_0_rgba(0,0,0,0.2)]"
      style={{ width, height }}
      role="progressbar"
      aria-valuenow={clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-blue-500 transition-width duration-300 rounded-3xl"
        style={{
          width: `${clampedProgress}%`,
          boxShadow: "inset 0 6px 12px rgba(0, 0, 0, 0.5)",
        }}
      />
      {/* Circle Indicator */}
      <div
        className="absolute top-1/2 bg-white rounded-full border-2 shadow-xl"
        style={{
          left: `${clampedProgress}%`,
          width: "20px",
          height: "20px",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none", 
          zIndex: 10, 
        }}
      />
      {/* Optional Label */}
      <div className="absolute w-full text-black font-bold top-full mt-2 text-center mt-4"
        style={{
            left: `${clampedProgress}%`,
            width: "20px",
            height: "20px",
            transform: "translate(-50%, -50%)", // Center vertically and adjust horizontally
            pointerEvents: "none", // Prevents the circle from capturing mouse events
            zIndex: 10, // Ensure the circle is above the progress bar
        }}
      >
        <p className="text-sm">{clampedProgress}%</p>
      </div>
    </div>
  );
};

export default HorizontalProgressBar;