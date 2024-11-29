'use client';

import React, { useState, useRef } from "react";

// Define the shape of the data
interface TableRow {
  id: number;
  datetime: string;
  person: string;
  image: string;
}

const LogShow: React.FC = () => {
  // Sample data for the table
  const data: TableRow[] = [
    { id: 1, datetime: "2023-11-25 10:00 AM", person: "John Doe", image: "log/profile1.jpg" },
    { id: 2, datetime: "2023-11-25 10:30 AM", person: "Jane Smith", image: "log/profile2.jpg" },
    { id: 3, datetime: "2023-11-25 11:00 AM", person: "Sam Johnson", image: "log/profile3.jpg" },
    { id: 4, datetime: "2023-11-25 11:30 AM", person: "Nancy Brown", image: "log/profile4.jpg" },
    { id: 5, datetime: "2023-11-25 12:00 PM", person: "Alice Williams", image: "log/profile5.jpg" },
    { id: 6, datetime: "2023-11-25 12:30 PM", person: "Bob Martin", image: "log/profile6.jpg" },
    { id: 7, datetime: "2023-11-25 01:00 PM", person: "Tom Lee", image: "log/profile7.jpg" },
    { id: 8, datetime: "2023-11-25 01:30 PM", person: "Sara Kim", image: "/profile8.jpg" },
    { id: 9, datetime: "2023-11-25 02:00 PM", person: "Liam Smith", image: "/profile9.jpg" },
    { id: 10, datetime: "2023-11-25 02:30 PM", person: "Olivia Johnson", image: "/profile10.jpg" },
    { id: 11, datetime: "2023-11-25 03:00 PM", person: "David Miller", image: "/profile11.jpg" },
    { id: 12, datetime: "2023-11-25 03:30 PM", person: "Sophia Davis", image: "/profile12.jpg" },
    { id: 13, datetime: "2023-11-25 04:00 PM", person: "Emma Wilson", image: "/profile13.jpg" },
    { id: 14, datetime: "2023-11-25 04:30 PM", person: "James Moore", image: "/profile14.jpg" },
    { id: 15, datetime: "2023-11-25 05:00 PM", person: "Isabella Lee", image: "/profile15.jpg" },
    { id: 16, datetime: "2023-11-25 05:30 PM", person: "Mason Walker", image: "/profile16.jpg" },
  ];

  const [rowsPerPage, setRowsPerPage] = useState<number>(6);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Function to handle the row selection change
  const handleRowChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
  };

  // Function to handle image click (to toggle camera view)
  const handleImageClick = () => {
    if (isCameraActive) {
      // If the camera is already active, stop it
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
      setIsCameraActive(false);
    } else {
      // Otherwise, start the camera
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setIsCameraActive(true);
          }
        })
        .catch((error) => {
          console.error("Error accessing webcam: ", error);
        });
    }
  };

  const slicedData = data.slice(0, rowsPerPage);
  const [isVisible, setIsVisible] = useState(true);


  return (
    <div>
      {/* Display selected image in the first div */}
        <div
            className="w-full shadow-2xl h-[250px] bg-slate-950 rounded-xl mb-6 cursor-pointer"
            onClick={handleImageClick}
        >
            {isCameraActive ? (
            <video
                ref={videoRef}
                autoPlay
                playsInline
                width="100%"
                height="100%"
                className="object-cover rounded-xl"
            />
            ) : selectedImage ? (
            <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-full object-cover rounded-xl"
            />
            ) : (
            <p className="text-white text-center">Click to open camera.</p>
            )}
        </div>

        <div className="flex flex-row justify-between">
            <p>Motion Sensor: Detected</p>
            
            <button 
                className={`w-25 h-10 shadow-md bg-[#e5f0e7] border-4 border-[#659A6E] text-[#659A6E] 
                    ${isVisible ? 'opacity-100' : 'opacity-0'} rounded-[20px] font-bold flex items-center 
                    justify-between px-2 text-base hover:bg-[#d4e8d6] hover:border-[#567d5e]`}
            >
                <span>Live view</span>
                <span className="w-6 h-6 bg-[#659A6E] rounded-full"></span>
            </button>

        </div>

      <div className="mb-4">
        <label htmlFor="rows" className="mr-2">Select Rows:</label>
        <select
          id="rows"
          value={rowsPerPage}
          onChange={handleRowChange}
          className="p-2 border rounded-md"
        >
          <option value={6}>6</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border-b px-4 py-2 text-left">Datetime</th>
              <th className="border-b px-4 py-2 text-left">Person</th>
              <th className="border-b px-4 py-2 text-left">Image</th>
            </tr>
          </thead>
          <tbody>
            {slicedData.map((row) => (
              <tr key={row.id}>
                <td className="border-b px-4 py-2">{row.datetime}</td>
                <td className="border-b px-4 py-2">{row.person}</td>
                <td className="border-b px-4 py-2">
                  <img
                    src={row.image}
                    alt={row.person}
                    className="w-8 h-8 rounded-full object-cover cursor-pointer"
                    onClick={() => setSelectedImage(row.image)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogShow;