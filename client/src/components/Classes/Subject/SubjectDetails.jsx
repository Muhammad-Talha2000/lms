import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Menu, X } from "lucide-react";
import SubjectService from "@/services/subjectService";
import { ClipLoader } from "react-spinners";
import SubjectSidebar from "./SubjectSidebar";
import DetailView from "./DetailView";
import CardView from "./CardView";
import { useSelector } from "react-redux";
import DefaultLayout from "@/components/layout/DefaultLayout";

const SubjectDetails = () => {
  const { subjectId } = useParams();
  const location = useLocation();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("details");
  const [selectedCard, setSelectedCard] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { loggedinUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  const refetchSubjectDetails = async () => {
    try {
      const response = await SubjectService.getSubjectById(subjectId);
      setSubject(response);
      setView("details");
    } catch (err) {
      console.error("Failed to fetch subject details:", err);
    }
  };

  useEffect(() => {
    if (!loggedinUser) {
      navigate("/login");
      return;
    }
    const fromNav = location.state?.subject;
    const matches =
      fromNav &&
      (fromNav._id === subjectId || fromNav._id?.toString() === subjectId);
    if (matches) {
      setSubject(fromNav);
      setLoading(false);
      setError(null);
      return;
    }
    fetchSubjectDetails();
  }, [subjectId, loggedinUser]);

  useEffect(() => {
    if (!mobileSidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileSidebarOpen]);

  const fetchSubjectDetails = async () => {
    try {
      setLoading(true);
      const data = await SubjectService.getSubjectById(subjectId);
      setSubject(data);
    } catch (err) {
      console.error("Error fetching subject:", err);
      setError("Failed to load subject details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 py-16">
          <ClipLoader size={48} color="#ff7f50" />
          <p className="text-sm text-gray-600">Loading subject…</p>
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="mx-auto max-w-lg px-4 py-10">
          <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </p>
        </div>
      </DefaultLayout>
    );
  }

  if (!subject) {
    return (
      <DefaultLayout>
        <div className="px-4 py-10 text-center text-gray-600">
          Subject not found.
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="flex w-full max-w-full min-w-0 flex-col overflow-x-hidden lg:flex-row lg:items-start min-h-[calc(100dvh-3.5rem)] sm:min-h-[calc(100dvh-4rem)] lg:min-h-[calc(100vh-8rem)]">
        <div className="sticky top-14 z-30 flex shrink-0 border-b border-gray-200 bg-white px-3 py-2 shadow-sm sm:top-16 lg:hidden">
          <button
            type="button"
            className="inline-flex w-full min-w-0 items-center justify-start gap-2 rounded-xl border border-gray-200 px-2 py-2.5 text-sm font-medium text-gray-800"
            onClick={() => setMobileSidebarOpen(true)}
            aria-expanded={mobileSidebarOpen}
            aria-label="Open subject menu"
          >
            <Menu className="h-5 w-5 shrink-0" />
            <span className="min-w-0 truncate text-left">
              Subject menu · {subject.name}
            </span>
          </button>
        </div>

        {mobileSidebarOpen && (
          <button
            type="button"
            className="fixed inset-x-0 bottom-0 top-14 z-40 bg-black/40 sm:top-16 lg:hidden"
            aria-label="Close menu"
            onClick={closeMobileSidebar}
          />
        )}

        <aside
          className={`
            fixed z-50 flex flex-col overflow-hidden bg-white p-0 lg:static lg:z-auto
            left-0 top-14 bottom-0 w-[min(92vw,20rem)] sm:top-16
            max-h-[calc(100dvh-3.5rem)] sm:max-h-[calc(100dvh-4rem)] lg:max-h-none lg:w-80 lg:min-w-[280px] lg:shrink-0
            transform transition-transform duration-200 ease-out
            ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
            lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-6rem)]
          `}
        >
          <div className="flex shrink-0 justify-end border-b border-gray-200 bg-white p-2 lg:hidden">
            <button
              type="button"
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              onClick={closeMobileSidebar}
              aria-label="Close subject menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <SubjectSidebar
              subject={subject}
              setView={setView}
              setSelectedCard={setSelectedCard}
              refetchSubjectDetails={refetchSubjectDetails}
              onItemSelect={closeMobileSidebar}
            />
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
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
        </main>
      </div>
    </DefaultLayout>
  );
};

export default SubjectDetails;
