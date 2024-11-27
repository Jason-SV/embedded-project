import React from 'react'
import Image from "next/image"

interface BannerProps {
  message: string
  backgroundColor: string
}

const Banner: React.FC<BannerProps> = ({ message, backgroundColor }) => {
  return (
    <div className='overflow-visible'>
        <div className='flex space justify-between text-xl font-bold'>
            <h1>Smart Farmer</h1>
            <Image 
                src="/lightbulb.svg"
                alt="lightbuld picture"
                width={30} 
                height={30}
                objectFit="contain"
                layout="fixed"
            />
        </div>
        <div className='relative h-[170px] overflow-visible'>
            <div className='absolute z-10 flex justify-between items-center w-full h-full'>
                <div className="w-[50%] flex items-center justify-center">
                    <h1 className="text-xl text-left text-white">MANAGE<br />Farm EASILY</h1>
                </div>
                <div className="w-[50%] h-[100%] relative z-20 overflow-visible absolute">
                    <Image 
                        src="/chawsuan.svg"
                        alt="chawsuan picture"
                        width={0} 
                        height={0}
                        objectFit="contain"
                        layout="fill"
                    />
                </div>
            </div>


            <div className='w-full h-full flex items-center justify-center'>
                <div className="relative text-lg shadow-xl rounded-lg w-full h-[70%]"
                    style={{
                        backgroundImage: "linear-gradient(to right, #5DB9FE , #5DB9FE )",
                        overflow: "hidden",
                    }} >
                        <div 
                            className="rounded-full absolute shadow-[0_20px_80px_0_rgba(250,250,250,0.3)]"
                            style={{
                                backgroundImage: "linear-gradient(to right, #3EADFE , #609DFF)",
                                top: "70%",
                                left: "10%", 
                                transform: "translate(-50%, -50%)", 
                                width: "500px",
                                height: "500px",
                                zIndex: 1, 
                            }} >
                        </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Banner