import React from "react";
import { AiFillThunderbolt } from "react-icons/ai";
import { FaMedal } from "react-icons/fa";
import { IoBulb } from "react-icons/io5";
import content1 from "../../assets/img/content1.png";
import content2 from "../../assets/img/content2.png";
import content3 from "../../assets/img/content3.png";


const Certifications = () => {
  return (
    <div
      className="container mx-auto py-16 flex gap-12 items-center justify-center min-h-screen h-fit"
      style={{ maxWidth: "90%" }}
    >
      {/* Left Side - Takes 50% of the container */}
      <div className="flex items-center justify-end w-[50%] gap-4">
        {/* First Box - Large Image */}
        <div className="h-[450px] w-[50%]">
          <img
          src={content1}
            alt="Main"
            className="w-full h-full object-cover rounded-lg "
          />
        </div>

        {/* Second Box - Two Images */}
        <div className="flex flex-col h-[450px] w-[50%] gap-6">
          <img
          src={content2}
            alt="Secondary 1"
            className="w-full h-1/2 object-cover rounded-lg shadow-lg"
          />
          <img
          src={content3}
           alt="Secondary 2"
            className="w-full h-1/2 object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Right Side - Takes 50% of the container */}
      <div className="w-[50%] px-8 flex flex-col items-start">
        {/* Badge */}
        <div className="flex items-center w-full">
          <span className="bg-[#daf2f0] flex items-center gap-2 px-3 py-2 rounded-3xl text-sm font-semibold">
            <div className="p-1 bg-white rounded-full">
              <AiFillThunderbolt color="ea580c" />
            </div>
            How We Start Journey!
          </span>
        </div>

        {/* Title & Description */}
        <h1 className="w-full font-bold text-3xl pt-3 leading-tight">
          We Care About Your Life For Better Future
        </h1>
        <p className="text-gray-600 text-md pt-3 leading-relaxed">
          This includes offering personalized feedback, fostering a sense of
          community through discussion forums and group projects, and providing
          continuous support to address challenges and improve.
        </p>

        {/* Certification Cards */}
        <div className="flex items-center gap-6 justify-start w-full border border-orange-500 py-5 px-6 rounded-lg mt-6 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-center bg-orange-100 p-4 h-14 w-14 rounded-full">
            <FaMedal color="orange" size={28} />
          </div>
          <div>
            <h1 className="font-bold text-lg">Master Certified Trainer</h1>
            <p className="text-sm text-gray-600">
              This includes offering personalized feedback, fostering a sense of
              community through discussion.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 justify-start w-full border border-orange-500 py-5 px-6 rounded-lg mt-6 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-center bg-orange-100 p-4 h-14 w-14 rounded-full">
            <IoBulb color="orange" size={28} />
          </div>
          <div>
            <h1 className="font-bold text-lg">Coach Certification Program</h1>
            <p className="text-sm text-gray-600">
              This includes offering personalized feedback, fostering a sense of
              community through discussion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certifications;
