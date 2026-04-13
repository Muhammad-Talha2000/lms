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
      question: "Which subjects and formats can I study here?",
      answer:
        "Browse STEM, creative arts, business, languages, and more—delivered as self-paced modules, live cohorts, or private coaching blocks so every learner finds the right tempo.",
    },
    {
      id: 2,
      question: "How do instructors keep mixed-ability classrooms engaged?",
      answer:
        "Faculty lean on formative check-ins, culturally responsive materials, and tiered assignments so every voice is heard while pacing stays ambitious yet achievable.",
    },
    {
      id: 3,
      question: "What supports exist for inclusive and differentiated learning?",
      answer:
        "Individual learning maps, co-teaching blocks, assistive tech integrations, and progress analytics help specialists and homeroom teachers stay coordinated in one hub.",
    },
  ];

  return (
    <div className="w-full max-w-full overflow-x-hidden box-border py-12 sm:py-16">
      <div className="container mx-auto flex flex-col lg:flex-row gap-8 lg:gap-6 items-start justify-center px-2 sm:px-4 max-w-7xl">
      {/* Left Side - image */}
      <div className="flex w-full lg:w-[40%] justify-center lg:justify-start shrink-0 min-w-0">
        <img
          src={faq}
          alt="Educator reviewing learner analytics on a laptop beside illustrated FAQ graphics"
          className="rounded-lg w-full max-w-md lg:max-w-none lg:w-[90%] h-56 sm:h-64 lg:h-80 object-cover mx-auto"
        />
      </div>

      {/* Right Side - FAQ */}
      <div className="w-full lg:w-[60%] px-0 sm:px-2 flex flex-col justify-start min-w-0">
        <div className="flex items-center w-full ">
          <span className="bg-[#daf2f0] flex items-center gap-2 px-3 py-2 rounded-3xl text-sm">
            <div className="p-1 bg-white rounded-full">
              <AiFillThunderbolt color="ea580c" />
            </div>
            Answers newcomers ask first
          </span>
        </div>

        <h1 className="w-full font-bold text-xl sm:text-2xl pt-2 break-words">
          Analytics, dashboards, and learning workflows in one cohesive toolkit
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
    </div>
  );
};

export default PerformanceDashboard;
