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
    <div
      className="container mx-auto py-16 -500 flex gap-4 items-center justify-center"
      style={{ maxWidth: "90%" }}
    >
      {/* Left Side - Takes 40% of the container */}
      <div className="flex items-end justify-end w-[40%] gap-4">
        {/* First Box - Image  */}
        <div className="flex flex-col">
          <img
            src={about1}
            alt=""
            className="rounded-tr-[40px] rounded-bl-[40px] shadow-lg w-full h-56  object-cover"
          />
          <div className="relative bg-orange-500 text-white p-4 rounded-tr-[40px] rounded-bl-[40px] flex items-center gap-2 shadow-lg mt-2">
            <div className="bg-white text-orange-500 rounded-full p-2 flex items-center justify-center">
              <Phone className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-semibold">ONLINE SUPPORT</p>
              <p className="text-xs font-semibold">+258 152 3659</p>
            </div>
          </div>
        </div>

        {/* Second Box - Only Image */}
        <div>
          <img
            src={about2}
            alt=""
            className="rounded-br-[40px] rounded-tl-[40px] shadow-lg w-full h-56 object-cover"
          />
        </div>
      </div>

      {/* Right Side - Takes 60% of the container */}
      <div className="w-[60%] px-4 flex flex-col items-start  ">
        <div className="flex items-center w-full ">
          <span className="bg-[#daf2f0] flex items-center gap-2 px-3 py-2 rounded-3xl text-sm">
            <div className="p-1 bg-white rounded-full">
              <AiFillThunderbolt color="ea580c" />
            </div>
            Get more about us
          </span>
        </div>
        <h1 className="w-full font-bold text-2xl pt-2">
          Over 10 Years in Distant learning for Skill Development
        </h1>
        <p className="text-gray-500 text-sm py-2">
          Compellingly procrastinate equity invested markets with efficient
          process improvements. actualize mission-critical partnerships with
          integrated portals. Authoritatively optimize low-risk high-yield
          metrics and plug-and-play potentialities.
        </p>

        <div className="flex gap-8 mb-8 items-center justify-evenly w-full">
          <div className="flex items-center gap-8">
            <div className=" rounded-full shadow-md bg-orange-50 h-12 w-12">
              <FiImage color="ea580c" className="p-3 h-full w-full" />
            </div>
            <div className="flex flex-col items-start">
              <h3 className="text-3xl font-bold text-orange-500 mt-4">
                <Counter number={105} title="+" />
              </h3>
              <p className="text-gray-600 mt-2">
                Total active students <br /> taking gifted courses
              </p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className=" rounded-full shadow-md bg-orange-50  h-12 w-12">
              <FaUserGraduate color="ea580c" className="p-3 h-full w-full" />
            </div>
            <div className="flex flex-col items-start">
              <h3 className="text-3xl font-bold text-orange-500 mt-4">
                <Counter number={6700} title="+" />
              </h3>
              <p className="text-gray-600 mt-2">
                Total active students <br /> taking gifted courses
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => navigate("/courses")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium"
        >
          Get Enrolled
        </Button>
      </div>
    </div>
  );
};

export default SuccessStories;
