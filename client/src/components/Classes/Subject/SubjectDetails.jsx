import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SubjectService from "@/services/subjectService";
import { ClipLoader } from "react-spinners";
import SubjectSidebar from "./SubjectSidebar";
import DetailView from "./DetailView";
import CardView from "./CardView";
import { useSelector } from "react-redux";

const SubjectDetails = () => {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(location.state?.subject || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("details");
  const [selectedCard, setSelectedCard] = useState(null);
  const { loggedinUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Function to fetch subject details
  const refetchSubjectDetails = async () => {
    try {
      const response = await SubjectService.getSubjectById(subjectId);
      setSubject(response);
      setView("details");
    } catch (error) {
      console.error("Failed to fetch subject details:", error);
    }
  };

  useEffect(() => {
    if (!loggedinUser) {
      navigate("/login");
    }
    if (!subject) {
      fetchSubjectDetails();
    } else {
      setLoading(false);
    }
  }, [subjectId]);

  const fetchSubjectDetails = async () => {
    try {
      setLoading(true);
      const data = await SubjectService.getSubjectById(subjectId);
      setSubject(data);
    } catch (error) {
      console.error("Error fetching subject:", error);
      setError("Failed to load subject details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader size={50} color="#ff7f50" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!subject) {
    return <p className="text-red-500">Subject not found.</p>;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar - Fixed Width */}
      <div className="w-80 flex-shrink-0">
        <SubjectSidebar
          subject={subject}
          setView={setView}
          setSelectedCard={setSelectedCard}
          refetchSubjectDetails={refetchSubjectDetails}
        />
      </div>

      {/* Main Content - Takes Remaining Space */}
      <div className="flex-1 overflow-y-auto p-6 bg-white">
        {view === "details" ? (
          <DetailView subject={subject} />
        ) : (
          <CardView
            data={selectedCard}
            setView={setView}
            subjectId={subjectId}
            refetchSubjectDetails={refetchSubjectDetails}
          />
        )}
      </div>
    </div>
  );
};

export default SubjectDetails;
