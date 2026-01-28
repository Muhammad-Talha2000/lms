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
}) => {
  const { type, data } = content;
  const { loggedinUser } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Accordion collapsible type="single">
        <AccordionItem value={type}>
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              {type}
              <span className="text-xs text-gray-500">({data?.length})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2">
              {data?.map((item, index) => (
                <Card
                  className="p-2 px-4 cursor-pointer"
                  key={index}
                  title={item.name || item.title}
                  onClick={() => {
                    setSelectedCard({ ...item, type });
                    setView("card");
                  }}
                >
                  <li className="font-semibold">{item.name || item.title}</li>
                </Card>
              ))}
            </ul>
            {loggedinUser.user.role === "instructor" && (
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
