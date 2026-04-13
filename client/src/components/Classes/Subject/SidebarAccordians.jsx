import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import AddContentModal from "./AddContent/AddContentModal";

const SidebarAccordians = ({
  content,
  setView,
  setSelectedCard,
  subjectId,
  refetchSubjectDetails,
  onItemSelect,
}) => {
  const { type, data } = content;
  const { loggedinUser } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Accordion collapsible type="single">
        <AccordionItem value={type}>
          <AccordionTrigger className="min-w-0 text-left hover:no-underline">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="break-words">{type}</span>
              <span className="shrink-0 text-xs text-gray-500">
                ({data?.length ?? 0})
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2">
              {data?.map((item, index) => (
                <Card
                  className="cursor-pointer p-2 px-3 sm:px-4"
                  key={index}
                  title={item.name || item.title}
                  onClick={() => {
                    setSelectedCard({ ...item, type });
                    setView("card");
                    onItemSelect?.();
                  }}
                >
                  <li className="break-words text-sm font-semibold leading-snug sm:text-base">
                    {item.name || item.title}
                  </li>
                </Card>
              ))}
            </ul>
            {loggedinUser?.user?.role === "instructor" && (
              <Button
                onClick={() => setIsModalOpen(true)}
                className="w-full mt-4 bg-orange-50 text-orange-500 hover:bg-orange-100 border-2 border-dashed border-orange-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {type}
              </Button>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {isModalOpen && (
        <AddContentModal
          refetchSubjectDetails={refetchSubjectDetails}
          subjectId={subjectId}
          content={content}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SidebarAccordians;
