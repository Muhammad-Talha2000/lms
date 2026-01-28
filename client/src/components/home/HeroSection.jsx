import React from "react";
import { Play } from "lucide-react";
import { AiFillThunderbolt } from "react-icons/ai";
// import hero_image from "../../assets/images/hero.png";
import hero_image from "../../assets/img/hero.png";
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
    <div className="bg-[#e8f0f3]">
      <div className="container ">
        <div className="flex flex-col md:flex-row items-center justify-center py-16 ">
          {/* Left Content */}
          <div className="md:w-2/3  space-y-6 px-12">
            {/* Welcome Badge */}
            <div className="flex items-center ">
              <span className="bg-white flex items-center gap-2 px-3 py-2 rounded-3xl text-sm">
                <div className="p-1 bg-[#daf2f0] rounded-full">
                  <AiFillThunderbolt color="ea580c" />
                </div>
                Welcome to Online Education
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Start learning from
              <br />
              the world's {""}
              <span className="text-orange-500">best institutions</span>
            </h1>

            {/* Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleStart}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium"
              >
                Get Started
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-orange-500">
                <Play className="w-4 h-4" />
                <span>Watch the video</span>
              </button>
            </div>

            {/* Enrollment Section */}
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                <img
                  src="/api/placeholder/32/32"
                  alt="Student 1"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                  src="/api/placeholder/32/32"
                  alt="Student 2"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                  src="/api/placeholder/32/32"
                  alt="Student 3"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              </div>
              <Counter number={1500} title="+" />
              <span className="text-sm text-gray-600"> Enrolled</span>
            </div>

            {/* Course Count */}
            <div>
              <p className="text-gray-600">
                Explore{" "}
                <span className="font-bold text-orange-500">1350+ Courses</span>{" "}
                within Subject
              </p>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative">
            <div className="w-[70%] ">
              <img
                src={hero_image}
                // src="https://s3-alpha-sig.figma.com/img/aa46/d83d/20303efa6b3daa1cc8a41dd049aa69c2?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Rz-6r6~t6xs9yW~xD0HWI0t3EcVeI6A8mywuqnEeIT~5weTA66RxH67siIv8gcnASxIqD92HANuglkcvzk1xW~ZK~jvghkDJqPIUOk2YYhdOpubk0ULLIpqTv1~oIWT3~U6gSgvEDySTF-~TOSMV79OY~K0UhKn5k5ZwGNUpm6tEz8InKg~Og0TF9fvVFt4hKisEMdFMhNO69dyqCEKG4wOKsdGT-8d5Omi24wrWwqkIeVddiq1WcXcZbjgpG2OPQ5MELF~x1SHCmwbzAnRejMKusc2HM4Oj53IP136W-6Z8FTQaFEPGrZ4rNEt1r1feXUQDjg8NPWxyUHk~8djKSg__"
                alt="Hero Image"
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="absolute top-40 -left-12 bg-white p-4 rounded-lg shadow-lg">
              <p className="text-2xl font-bold text-orange-500">
                <Counter number={250} title="+" />
              </p>
              <p className="text-sm text-gray-600"> CRASHED COURSES</p>
            </div>
            <div className="absolute -bottom-4 right-16 w-32 h-32 border-2 border-dashed border-orange-500 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
