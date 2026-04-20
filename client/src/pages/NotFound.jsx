import { BookOpen, Home } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-xl"
      >
        <BookOpen className="w-16 h-16 text-orange-500 mx-auto" />
        <h1 className="text-4xl font-bold text-orange-500 mt-4">
          This page is unavailable
        </h1>
        <p className="text-gray-500 mt-2">
          The link may be outdated or the lesson may have moved—let’s get you back on track.
        </p>
        <div className="mt-6 space-x-4">
          <Button onClick={() => navigate(-1)} variant="outline">
            <BookOpen className="w-5 h-5 mr-2" /> Previous screen
          </Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => navigate("/")}
          >
            <Home className="w-5 h-5 mr-2" /> Go to homepage
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
