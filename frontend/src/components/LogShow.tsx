'use client';

import getHistory from "@/libs/getHistory";
import getNetpieData from "@/libs/getNetpieData";
import React, { useState, useRef , useEffect } from "react";

// Define the shape of the data
interface TableRow {
  id: number;
  datetime: string;
  person: string;
  image: string;
}

const LogShow = () => {
  // Sample data for the table
  const [data, setData] = useState<TableRow[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(6);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [motionDetected, setMotionDetected] = useState<boolean>(false);

  let netpieData: any;

  // Fetch the data when the component mounts
  useEffect(() => {
    const fetchData = setInterval(async () => {
      try {
        const fetchedData = await getHistory();
        // Map the fetched data to match the component's expected format
        const formattedData = fetchedData.map((item: any) => ({
          id: item._id,
          datetime: new Date(item.Datetime).toLocaleString(), // Format the date
          person: item.Person ? "Yes" : "No",
          image: item.ImageUrl,
        }));
        setData(formattedData); 

        // Fetch motion sensor data
        netpieData = await getNetpieData('de7beba1-0a57-4ab9-a049-cb8df3bfb050', 'owuak9Jonp7LNz9geqrNtWPM1Sgu8bDn');
        if (netpieData.data.motion === 1) {
          setMotionDetected(true);
        } else {
          setMotionDetected(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 1000);

    return () => {
      clearInterval(fetchData);
    }
  }, []);

  // Function to handle the row selection change
  const handleRowChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
  };


  // // Function to handle image click (to toggle camera view)
  // const handleImageClick = () => {
  //   if (isCameraActive) {
  //     // If the camera is already active, stop it
  //     if (videoRef.current?.srcObject) {
  //       const stream = videoRef.current.srcObject as MediaStream;
  //       const tracks = stream.getTracks();
  //       tracks.forEach((track) => track.stop());
  //     }
  //     setIsCameraActive(false);
  //   } else {
  //     // Otherwise, start the camera
  //     navigator.mediaDevices.getUserMedia({ video: true })
  //       .then((stream) => {
  //         if (videoRef.current) {
  //           videoRef.current.srcObject = stream;
  //           setIsCameraActive(true);
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error accessing webcam: ", error);
  //       });
  //   }
  // };

  const slicedData = data.slice(0, rowsPerPage);
  const [isVisible, setIsVisible] = useState(true);


  return (
    <div>
      {/* Display selected image in the first div */}
        <div
            className="w-full shadow-2xl h-[250px] bg-slate-950 rounded-xl mb-6 cursor-pointer"
            // onClick={}
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
                className="w-full h-full object-cover rounded-xl rotate-180"
            />
            ) : (
            <p className="text-white text-center">Click a image in image Column</p>
            )}
        </div>

        <div className="flex flex-row justify-between">
          
          <p className="font-bold text-base">
            Motion Sensor: 
            <span className={`ml-2 ${motionDetected ? "text-green-500" : "text-red-500"}`}>
              {motionDetected ? "Detected" : "Not Detected"}
            </span>
          </p>
            
          <button 
              className={`w-25 h-10 shadow-md bg-[#e5f0e7] border-4 border-[#659A6E] text-[#659A6E] 
                  ${isVisible ? 'opacity-100' : 'opacity-0'} rounded-[20px] font-bold flex items-center 
                  justify-between px-2 text-base hover:bg-[#d4e8d6] hover:border-[#567d5e]`}
              // onClick={handleImageClick}
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
          <option value={100}>100</option>
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
                    className="w-8 h-8 rounded-md object-cover cursor-pointer"
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