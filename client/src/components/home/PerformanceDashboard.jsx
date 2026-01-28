import React from "react";
import { AiFillThunderbolt } from "react-icons/ai";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import faq from "../../assets/img/faq.png";


const PerformanceDashboard = () => {
  const faqs = [
    {
      id: 1,
      question: "What courses do you offer?",
      answer:
        "We offer a wide range of courses in various subjects, including science, technology, engineering, mathematics, humanities, and social sciences. Our courses are designed for different education levels, from primary school to university.",
    },
    {
      id: 2,
      question: "How Can Teachers Effectively Manage a Diverse Classroom?",
      answer:
        "Effective management of a diverse classroom involves understanding individual needs, fostering inclusivity, and using differentiated instruction techniques to engage students.",
    },
    {
      id: 3,
      question: "How Is Special Education Delivered in Inclusive Classrooms?",
      answer:
        "Special education in inclusive classrooms is delivered through personalized learning plans, co-teaching methods, and providing assistive technologies to support students with special needs.",
    },
  ];

  return (
    <div
      className="container mx-auto py-16 -500 flex gap-4 items-start justify-center"
      style={{ maxWidth: "80%" }}
    >
      {/* Left Side - Takes 40% of the container */}
      <div className="flex  w-[40%] justify-start">
        <img
        src={faq} alt=""
          className="rounded-lg w-[80%] h-80 object-cover"
        />
      </div>

      {/* Right Side - Takes 60% of the container */}
      <div className="w-[60%] px-4 flex flex-col justify-start">
        <div className="flex items-center w-full ">
          <span className="bg-[#daf2f0] flex items-center gap-2 px-3 py-2 rounded-3xl text-sm">
            <div className="p-1 bg-white rounded-full">
              <AiFillThunderbolt color="ea580c" />
            </div>
            Most asked questions
          </span>
        </div>

        <h1 className="w-full font-bold text-2xl pt-2">
          Powerful Dashboard And High Performance Framework
        </h1>

        {/* Question and answers */}

        <Accordion type="single" collapsible className="w-full mt-4">
          {faqs.map((faq) => (
            <AccordionItem value={faq.id} key={faq.id}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
