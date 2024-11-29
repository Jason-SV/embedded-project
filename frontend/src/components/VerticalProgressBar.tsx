// VerticalProgressBar.tsx
import React from "react";

// Define prop types
interface VerticalProgressBarProps {
  progress: number;
  width?: string; // Width of the progress bar (e.g., '24px', 'w-6')
  height?: string; // Height of the progress bar (e.g., '192px', 'h-48')
  maxValue: number; // maximum value of the progress
}

const VerticalProgressBar: React.FC<VerticalProgressBarProps> = ({
  progress,
  width = "90px",
  height = "300px",
  maxValue,
}) => {
  return (
    <div
      className="relative rounded-3xl bg-gray-200 overflow-hidden shadow-[0_20px_80px_0_rgba(0,0,0,0.3)]"
      style={{ width, height }}
    >
      <div
        className="absolute bottom-0 w-full bg-gradient-to-t from-green-400 to-blue-500 transition-all duration-500 ease-in-out"
        style={{
          height: `${Math.min(Math.max(progress, 0), 100)}%`,
          boxShadow: "0 -10px 20px rgba(59, 130, 246, 0.5)"
        }}
      />
      <div>
        <div className="absolute w-full text-white font-bold bottom-0 text-center mb-3">
            <p className="text-2xl"> 
                {progress}%
            </p>
            <p className="text-xs">
                intensity
            </p>
          
        </div>
      </div>
    </div>
  );
};

export default VerticalProgressBar;