import React from "react";
import { AiFillThunderbolt } from "react-icons/ai";
import { FaMedal } from "react-icons/fa";
import { IoBulb } from "react-icons/io5";
import content1 from "../../assets/img/content1.png";
import content2 from "../../assets/img/content2.png";
import content3 from "../../assets/img/content3.png";


const Certifications = () => {
  return (
    <div className="w-full max-w-full overflow-x-hidden box-border py-12 sm:py-16 min-h-0">
      <div className="container mx-auto flex flex-col xl:flex-row gap-10 xl:gap-12 items-center justify-center px-2 sm:px-4 max-w-7xl">
      {/* Left Side - gallery */}
      <div className="flex flex-col sm:flex-row items-stretch justify-center xl:justify-end w-full xl:w-1/2 gap-4 min-w-0">
        <div className="h-64 sm:h-80 md:h-96 w-full sm:w-1/2 min-h-[16rem]">
          <img
            src={content1}
            alt="Instructor leading a certification workshop for remote learners"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="flex flex-col h-64 sm:h-80 md:h-96 w-full sm:w-1/2 gap-4 min-h-[16rem]">
          <img
            src={content2}
            alt="Learners collaborating during a skills lab session"
            className="w-full flex-1 min-h-0 object-cover rounded-lg shadow-lg"
          />
          <img
            src={content3}
            alt="Team reviewing digital coursework on tablets"
            className="w-full flex-1 min-h-0 object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Right Side - copy */}
      <div className="w-full xl:w-1/2 px-0 sm:px-2 xl:px-6 flex flex-col items-start min-w-0">
        {/* Badge */}
        <div className="flex items-center w-full">
          <span className="bg-[#daf2f0] flex items-center gap-2 px-3 py-2 rounded-3xl text-sm font-semibold">
            <div className="p-1 bg-white rounded-full">
              <AiFillThunderbolt color="ea580c" />
            </div>
            Where your growth story begins
          </span>
        </div>

        {/* Title & Description */}
        <h1 className="w-full font-bold text-2xl sm:text-3xl pt-3 leading-tight break-words">
          We invest in your future—starting with the very first lesson
        </h1>
        <p className="text-gray-600 text-md pt-3 leading-relaxed">
          Expect tailored feedback loops, vibrant discussion spaces, and cohort
          projects that mirror real workplaces, plus steady guidance whenever concepts
          feel challenging.
        </p>

        {/* Certification Cards */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 justify-start w-full border border-orange-500 py-5 px-4 sm:px-6 rounded-lg mt-6 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-center bg-orange-100 p-4 h-14 w-14 rounded-full shrink-0">
            <FaMedal color="orange" size={28} />
          </div>
          <div>
            <h1 className="font-bold text-lg">Master certified facilitator track</h1>
            <p className="text-sm text-gray-600">
              Deep-dive facilitation labs, observational coaching, and peer circles
              that sharpen how you guide adult learners online.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 justify-start w-full border border-orange-500 py-5 px-4 sm:px-6 rounded-lg mt-6 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center justify-center bg-orange-100 p-4 h-14 w-14 rounded-full shrink-0">
            <IoBulb color="orange" size={28} />
          </div>
          <div>
            <h1 className="font-bold text-lg">Professional coaching credential</h1>
            <p className="text-sm text-gray-600">
              Scenario-based practice, accountability partners, and rubric-backed
              assessments that prove you can coach for performance—not just compliance.
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Certifications;
