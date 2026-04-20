import React from "react";
import { Play } from "lucide-react";
import { AiFillThunderbolt } from "react-icons/ai";
import hero_image from "../../assets/img/about1.png";
import learnerOne from "../../assets/img/team1.png";
import learnerTwo from "../../assets/img/team2.png";
import learnerThree from "../../assets/img/team3.png";
import Counter from "../ui/Counter";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const { loggedinUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleStart = () => {
    if (loggedinUser?.token) {
      navigate("/courses");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="bg-[#e8f0f3] w-full max-w-full overflow-x-hidden">
      <div className="container mx-auto max-w-full px-0 sm:px-2">
        <div className="flex flex-col md:flex-row items-center justify-center py-10 sm:py-16 gap-8 md:gap-4">
          {/* Left Content */}
          <div className="w-full md:w-2/3 space-y-5 sm:space-y-6 px-4 sm:px-6 md:px-10 min-w-0">
            {/* Welcome Badge */}
            <div className="flex items-center ">
              <span className="bg-white flex items-center gap-2 px-3 py-2 rounded-3xl text-sm">
                <div className="p-1 bg-[#daf2f0] rounded-full">
                  <AiFillThunderbolt color="ea580c" />
                </div>
                Remote learning, thoughtfully designed
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight break-words">
              Learn alongside
              <br />
              globally recognized {""}
              <span className="text-orange-500">schools & trainers</span>
            </h1>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={handleStart}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium"
              >
                Start learning
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-orange-500">
                <Play className="w-4 h-4" />
                <span>Preview the experience</span>
              </button>
            </div>

            {/* Enrollment Section */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex -space-x-2 shrink-0">
                <img
                  src={learnerOne}
                  alt="Learner community member portrait"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                  src={learnerTwo}
                  alt="Learner community member portrait"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                  src={learnerThree}
                  alt="Learner community member portrait"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              </div>
              <Counter number={1500} title="+" />
              <span className="text-sm text-gray-600"> active learners</span>
            </div>

            {/* Course Count */}
            <div>
              <p className="text-gray-600">
                Dive into{" "}
                <span className="font-bold text-orange-500">1,350+ programs</span>{" "}
                spanning every major discipline
              </p>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative w-full max-w-lg md:max-w-none md:flex-1 flex justify-center md:justify-end px-2 min-w-0">
            <div className="w-full max-w-md md:max-w-none md:w-[70%]">
              <img
                src={hero_image}
                alt="Students collaborating during an online lesson on the Smartflow LMS platform"
                className="w-full h-auto max-h-[min(70vh,420px)] md:max-h-none object-contain md:object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="absolute top-[55%] sm:top-40 left-2 sm:left-0 md:-left-4 lg:-left-8 bg-white p-3 sm:p-4 rounded-lg shadow-lg max-w-[calc(100%-1rem)]">
              <p className="text-xl sm:text-2xl font-bold text-orange-500">
                <Counter number={250} title="+" />
              </p>
              <p className="text-xs sm:text-sm text-gray-600"> intensive bootcamps</p>
            </div>
            <div className="hidden sm:block absolute -bottom-4 right-4 md:right-16 w-24 h-24 md:w-32 md:h-32 border-2 border-dashed border-orange-500 rounded-full pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
