// TempChart.tsx
import React from 'react';

// Define prop types
interface TempChartProps {
    progress: number; // percentage of progress (0 to 100)
    radius: number; // radius of the circle
    strokeWidth: number; // width of the stroke
    unit: string; // unit of the progress (e.g., '°C', '°F')
    maxValue: number; // maximum value of the progress
}

const TempChart: React.FC<TempChartProps> = ({
    progress,
    radius,
    strokeWidth,
    unit,
    maxValue,
}) => {
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / maxValue) * circumference;

    const margin = 10; // Additional margin around the chart
    const totalSize = (radius + strokeWidth) * 2;
    const viewBoxSize = totalSize + margin * 2;
    const center = viewBoxSize / 2;

    return (
        <svg
            width={viewBoxSize}
            height={viewBoxSize}
            viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
            style={{ transform: 'rotate(-90deg)' }}
        >
            <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#000" floodOpacity="0.3" />
                </filter>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#60e6a8" />
                    <stop offset="100%" stopColor="#00b4db" />
                </linearGradient>
            </defs>
            <circle
                r={radius}
                cx={center}
                cy={center}
                fill="transparent"
                stroke="#e0e0e0"
                strokeWidth={strokeWidth}
                filter="url(#shadow)"
            />
            <circle
                r={radius}
                cx={center}
                cy={center}
                fill="transparent"
                stroke="url(#progressGradient)"
                strokeLinecap="round"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference}px`}
                strokeDashoffset={`${strokeDashoffset}px`}
                filter="url(#shadow)"
                style={{
                    transition: 'stroke-dashoffset 1s ease-out',
                }}
            />
            <text
                x={center}
                y={center + 8}
                textAnchor="middle"
                fontSize="24px"
                fill="#000000"
                fontWeight="bold"
                transform={`rotate(90, ${center}, ${center})`}
                
            >
                {progress} {unit} 
            </text>
        </svg>
    );
};

export default TempChart;