import React from "react";

const TrialClassCard = () => {
  return (
    <div className="flex container items-center gap-8 bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      {/* Left Section */}
      <div className="flex flex-col w-fit">
        <h2 className="text-3xl font-bold leading-tight text-gray-800">
          Learn Python <br /> within 30 Days
        </h2>
        <p className="text-gray-500 mt-4 leading-relaxed">
          Time to become advanced than others with this course. Improve your
          skills and achieve your goals with ease.
        </p>
        <div className="flex items-center gap-4 mt-6">
          {/* Join Trial Class Button */}
          <button className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all">
            Join Trial Class
          </button>
          {/* Skip Button */}
          <button className="text-gray-400 hover:text-gray-600 transition-all">
            Skip
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-96">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYbsJFulTRg3kb36fs2oHH0rDX5C0uJ6HBDQ&s"
          alt="Python Class"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default TrialClassCard;
