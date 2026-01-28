import React from "react";
import Counter from "../ui/Counter";

const StatsSection = () => {
  const stats = [
    { value: 3192, label: "Successfully Trained",sign: "+" },
    { value: 15485, label: "Classes Completed",sign: "+" },
    { value: 97, label: "Satisfaction Rate",sign: "%" },
    { value: 96, label: "Satisfaction Rate", sign: "%" },
  ];

  return (
    <div className="bg-orange-500 py-12 my-16">
      <div className="container mx-auto flex flex-col md:flex-row justify-evenly w-[80%] items-center text-white text-center gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col items-center">
            <h3 className="text-4xl font-bold"><Counter number={stat.value}  title={stat.sign}/></h3>
            <p className="text-lg mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;
