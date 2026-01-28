import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, Edit, Users, ChevronDown } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuItem,
} from "../ui/sidebar";

const Sidebar = ({ onEdit, onAdd, className, setActiveTab }) => {
  return (
    <div className="w-[15%] p-4 bg-gray-100 min-h-screen border-r">
      <h3 className="text-lg font-bold mb-4">{className || "Class Details"}</h3>
      <nav className="space-y-2">
        <Link
          to="/admin"
          className={cn(
            "flex items-center gap-2 p-2 rounded hover:bg-gray-200"
          )}
        >
          <Home className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Button
          variant="ghost"
          className="w-full flex justify-start gap-2"
          onClick={() => setActiveTab("classDetails")}
        >
          <BookOpen className="w-5 h-5" />
          Class Details
        </Button>

        <Button
          variant="ghost"
          className="w-full flex justify-start gap-2"
          onClick={onEdit}
        >
          <Edit className="w-5 h-5" />
          Edit Class
        </Button>
        <Button
          variant="ghost"
          className="w-full flex justify-start gap-2"
          onClick={() => setActiveTab("subjects")}
        >
          <BookOpen className="w-5 h-5" />
          Manage Subjects
        </Button>
        {/* add subject */}
        <Button
          variant="ghost"
          className="w-full flex justify-start gap-2"
          onClick={onAdd}
        >
          <BookOpen className="w-5 h-5" />
          Add Subject
        </Button>
        {/* add student */}
      </nav>
    </div>
  );
};

export default Sidebar;
