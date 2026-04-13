import React from "react";
import Counter from "../ui/Counter";

const StatsSection = () => {
  const stats = [
    { value: 3192, label: "Professionals upskilled", sign: "+" },
    { value: 15485, label: "Live & async sessions finished", sign: "+" },
    { value: 97, label: "Average learner satisfaction", sign: "%" },
    { value: 96, label: "Programs completed on schedule", sign: "%" },
  ];

  return (
    <div className="bg-orange-500 py-10 sm:py-12 my-10 sm:my-16 w-full max-w-full overflow-x-hidden">
      <div className="container mx-auto flex flex-col sm:flex-row flex-wrap justify-evenly w-full max-w-6xl px-4 items-center text-white text-center gap-6 sm:gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col items-center min-w-0 px-2">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold break-all sm:break-normal">
              <Counter number={stat.value} title={stat.sign} />
            </h3>
            <p className="text-base sm:text-lg mt-2 max-w-[10rem] sm:max-w-none">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;
