import React from "react";
import { Phone } from "lucide-react";
import { AiFillThunderbolt } from "react-icons/ai";
import { FiImage } from "react-icons/fi";
import { FaUserGraduate } from "react-icons/fa";
import about1 from "../../assets/img/about1.png";
import about2 from "../../assets/img/about2.png";
import Counter from "../ui/Counter";
import { Button } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

const SuccessStories = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-full overflow-x-hidden box-border py-12 sm:py-16">
      <div className="container mx-auto flex flex-col lg:flex-row gap-8 lg:gap-6 items-stretch lg:items-center justify-center px-2 sm:px-4 max-w-7xl">
      {/* Left Side - images */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-center lg:justify-end w-full lg:w-[42%] gap-4 min-w-0">
        {/* First Box - Image  */}
        <div className="flex flex-col">
          <img
            src={about1}
            alt="Learners collaborating in a blended classroom workshop"
            className="rounded-tr-[40px] rounded-bl-[40px] shadow-lg w-full min-h-[14rem] h-56 max-h-64 object-cover"
          />
          <div className="relative bg-orange-500 text-white p-4 rounded-tr-[40px] rounded-bl-[40px] flex items-center gap-2 shadow-lg mt-2">
            <div className="bg-white text-orange-500 rounded-full p-2 flex items-center justify-center">
              <Phone className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-semibold">DEDICATED HELP LINE</p>
              <p className="text-xs font-semibold">+258 152 3659</p>
            </div>
          </div>
        </div>

        {/* Second Box - Only Image */}
        <div>
          <img
            src={about2}
            alt="Graduates celebrating milestone achievements after finishing coursework"
            className="rounded-br-[40px] rounded-tl-[40px] shadow-lg w-full min-h-[14rem] h-56 max-h-64 object-cover"
          />
        </div>
      </div>

      {/* Right Side - copy */}
      <div className="w-full lg:w-[58%] px-0 sm:px-2 lg:px-4 flex flex-col items-start min-w-0">
        <div className="flex items-center w-full ">
          <span className="bg-[#daf2f0] flex items-center gap-2 px-3 py-2 rounded-3xl text-sm">
            <div className="p-1 bg-white rounded-full">
              <AiFillThunderbolt color="ea580c" />
            </div>
            Why teams choose NexaLearn
          </span>
        </div>
        <h1 className="w-full font-bold text-xl sm:text-2xl pt-2 break-words">
          More than ten years guiding learners through remote, skills-first education
        </h1>
        <p className="text-gray-500 text-sm py-2">
          We pair structured curricula with human coaching so knowledge sticks—from
          onboarding bootcamps to advanced certifications—while dashboards keep every
          stakeholder aligned on outcomes.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-8 items-start sm:items-center justify-start sm:justify-evenly w-full">
          <div className="flex items-center gap-4 sm:gap-8 w-full sm:w-auto min-w-0">
            <div className=" rounded-full shadow-md bg-orange-50 h-12 w-12">
              <FiImage color="ea580c" className="p-3 h-full w-full" />
            </div>
            <div className="flex flex-col items-start">
              <h3 className="text-3xl font-bold text-orange-500 mt-4">
                <Counter number={105} title="+" />
              </h3>
              <p className="text-gray-600 mt-2">
                Learners actively advancing <br /> through mentor-led pathways
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-8 w-full sm:w-auto min-w-0">
            <div className=" rounded-full shadow-md bg-orange-50  h-12 w-12">
              <FaUserGraduate color="ea580c" className="p-3 h-full w-full" />
            </div>
            <div className="flex flex-col items-start">
              <h3 className="text-3xl font-bold text-orange-500 mt-4">
                <Counter number={6700} title="+" />
              </h3>
              <p className="text-gray-600 mt-2">
                Credentials & milestones <br /> issued to graduates worldwide
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => navigate("/courses")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium"
        >
          Explore programs
        </Button>
      </div>
      </div>
    </div>
  );
};

export default SuccessStories;
