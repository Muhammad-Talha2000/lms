import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaTags } from "react-icons/fa6";
import { HiOutlineCalendar } from "react-icons/hi2";
import { LuBookText } from "react-icons/lu";
import { CiBookmark } from "react-icons/ci";
import { FaLevelUpAlt } from "react-icons/fa";
import { BsClock } from "react-icons/bs";
import { BsPerson } from "react-icons/bs";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import DefaultLayout from "../layout/DefaultLayout";
import { getCourseById } from "@/services/courseService";
import { confirmStripeCheckoutSession } from "@/services/paymentService";
import { useToast } from "@/hooks/use-toast";
import BuyNowButton from "./Payment Card Button/BuyNowButton";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { IoLanguage } from "react-icons/io5";
import { SiTestcafe } from "react-icons/si";
import GooglePayButton from "@google-pay/button-react";

function CourseDetails() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { loggedinUser } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    name: "",
    description: "",
    thumbnail: "",
    price: 0,
    duration: "",
    language: "",
    courseLevel: "",
    tags: [],
    contentLibrary: [],
    lessons: [],
    assignments: [],
    quizzes: [],
  });
  const [activeTab, setActiveTab] = useState("overview");

  // Function to handle tab clicks
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const data = await getCourseById(id);
      setCourse(data);
    } catch (error) {
      console.error("Error fetching course:", error);
      setError("Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  useEffect(() => {
    const ok = searchParams.get("stripe_success");
    const sessionId = searchParams.get("session_id");
    if (ok !== "1" || !sessionId || !loggedinUser?.token) return;

    let active = true;
    (async () => {
      try {
        await confirmStripeCheckoutSession(sessionId, loggedinUser.token);
        if (!active) return;
        toast({
          title: "Payment successful",
          description: "You are now enrolled in this course.",
          className: "bg-green-600 text-white",
        });
        setSearchParams({}, { replace: true });
        fetchCourse();
      } catch (e) {
        if (!active) return;
        const msg =
          e.response?.data?.error ||
          e.response?.data?.message ||
          e.message ||
          "Could not complete enrollment.";
        toast({ title: "Enrollment", description: msg, variant: "destructive" });
        setSearchParams({}, { replace: true });
      }
    })();

    return () => {
      active = false;
    };
  }, [searchParams, loggedinUser?.token]);

  if (loading) return <p>Loading course details...</p>;
  if (error) return <p>{error}</p>;
  if (!course) return <p>No course found.</p>;

  return (
    <DefaultLayout>
      {/* <PageHeader /> */}
      <div className="w-[80%] mx-auto px-4 py-8 ">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Section */}
          <Card className="w-full md:w-3/4 lg:w-2/3 bg-white shadow-md rounded-lg">
            {/* Header with Image */}
            <div className="p-6">
              <div className="relative mb-4 h-">
                <img
                  src={course?.thumbnail} // Replace with actual image URL
                  alt="Course Preview"
                  className="w-full h-96 object-cover  rounded-t-md"
                />
              </div>
              {/* <div className="flex flex-wrap  gap-2 mb-2">
                <span className="bg-orange-500 text-white text-sm px-3 py-1  rounded">
                  Best Seller
                </span>
                <span className="bg-orange-400 text-white text-sm  px-3 py-1  rounded">
                  Latest
                </span>
              </div> */}
              {/* Course Title and Meta */}
              <div className="mb-4">
                <h1 className="text-xl md:text-2xl font-bold mb-4">
                  {course?.name}
                </h1>
                <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
                  <ul className="flex flex-wrap gap-4 mb-2">
                    <li className="flex pr-4 border-r-2 gap-2 md:border-r-2 items-center">
                      <Avatar className="w-7 h-7">
                        <AvatarImage
                          src={course?.instructor?.profileImage}
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span className="text-orange-500 font-bold">
                        Instructor:
                      </span>
                      {course?.instructor?.name}
                    </li>
                    <li className="flex items-center pr-4 gap-2 border-r-2">
                      <FaTags />
                      {course?.tags[0]}
                    </li>
                    <li className="flex gap-2 items-center pr-4 border-r-2">
                      <HiOutlineCalendar />
                      {/* {course.createdAt.split("T")[0]} */}
                      {course?.createdAt
                        ? course.createdAt.split("T")[0]
                        : "N/A"}
                    </li>
                    <li className="pr-4 flex items-center">
                      <span className="text-orange-500 mr-2">⭐⭐⭐⭐⭐</span>
                      {/* <span className="text-gray-600">(4.88){id}</span> */}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="border-t border-gray-200 bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Tabs Navigation */}
              <ul className="flex flex-wrap bg-gray-50 justify-around items-center text-center border-b border-gray-200">
                <li
                  className={`relative flex gap-2 items-center font-medium p-4 cursor-pointer transition-colors duration-200 ${
                    activeTab === "overview"
                      ? "text-orange-500 font-semibold"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                  onClick={() => handleTabClick("overview")}
                >
                  <CiBookmark className="text-lg" />
                  <span>Overview</span>
                  {activeTab === "overview" && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></div>
                  )}
                </li>
                <li
                  className={`relative flex gap-2 items-center font-medium p-4 cursor-pointer transition-colors duration-200 ${
                    activeTab === "curriculum"
                      ? "text-orange-500 font-semibold"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                  onClick={() => handleTabClick("curriculum")}
                >
                  <LuBookText className="text-lg" />
                  <span>Curriculum</span>
                  {activeTab === "curriculum" && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></div>
                  )}
                </li>
                <li
                  className={`relative flex gap-2 items-center font-medium p-4 cursor-pointer transition-colors duration-200 ${
                    activeTab === "instructor"
                      ? "text-orange-500 font-semibold"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                  onClick={() => handleTabClick("instructor")}
                >
                  <BsPerson className="text-lg" />
                  <span>Instructor</span>
                  {activeTab === "instructor" && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></div>
                  )}
                </li>
              </ul>

              {/* Tab Content */}
              <div className="p-6">
                {/* Overview Content */}
                {activeTab === "overview" && (
                  <div className="animate-fadeIn">
                    <h2 className="text-lg font-bold text-gray-700 mb-4 text-gray-800">
                      Course Description
                    </h2>
                    <div
                      className="text-gray-600 leading-relaxed space-y-4"
                      dangerouslySetInnerHTML={{ __html: course?.description }}
                    />
                  </div>
                )}

                {/* Curriculum Content */}
                {activeTab === "curriculum" && (
                  <div className="animate-fadeIn">
                    <div className="mb-8">
                      <h3 className="text-lg font-bold mb-3 text-gray-700 flex items-center">
                        <span className="inline-block w-8 h-8 rounded-full bg-orange-100 text-orange-500 mr-2 flex items-center justify-center text-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        Learning Objectives
                      </h3>

                      {course?.lessons ? (
                        <ul className="space-y-2 pl-6">
                          {course.lessons.map((lesson, index) => (
                            <li
                              key={index}
                              className="text-gray-600 flex items-center"
                            >
                              <span className="text-green-500 mr-2 mt-1">
                                •
                              </span>
                              <span className="font-semibold">
                                {lesson.title}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic pl-6">
                          No learning objectives specified
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Instructor Content */}
                {activeTab === "instructor" && (
                  <div className="animate-fadeIn">
                    <h2 className="text-lg font-bold mb-6 text-gray-800">
                      Meet Your Instructor
                    </h2>

                    {course?.instructor ? (
                      <div className="flex flex-col md:flex-row items-start ">
                        <div className="flex-1">
                          <h3 className="text-md font-bold text-orange-500">
                            Name: {course.instructor.name}
                          </h3>
                          {course.instructor.qualification &&
                            course.instructor.teaching_experience &&
                            course.instructor.subjects && (
                              <>
                                <p className="text-gray-500 font-medium ">
                                  Qualification:{" "}
                                  {course.instructor.qualification}
                                </p>

                                <div className="text-gray-500 font-medium  ">
                                  Teaching Experience (Years): {""}
                                  {course.instructor.teaching_experience}
                                </div>

                                <div className="text-gray-500 font-medium ">
                                  Subjects Taught: {course.instructor.subjects}
                                </div>
                              </>
                            )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        Instructor details not available
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Right Sidebar */}
          <div className="w-full md:w-1/2 lg:w-1/3">
            <Card className="bg-white rounded-md mb-4 shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-4xl font-bold text-gray-900 ">
                  Rs. {course?.price}
                </h1>
                <button className="bg-orange-500  p-4 rounded-full text-xs font-bold text-white">
                  25% OFF
                </button>
              </div>

              {/* {(course?.enrolledStudents || []).some(
                (student) =>
                  student?._id?.toString() ===
                  loggedinUser?.user?._id?.toString()
              ) ? (
                <Button
                  onClick={() => navigate(`/learner-page/${id}`)}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  Go to course
                </Button>
              ) : (
                <BuyNowButton courseId={id} />
              )} */}

              {(course?.enrolledStudents || []).some(
                (student) =>
                  student?._id?.toString() ===
                  loggedinUser?.user?._id?.toString()
              ) ? (
                <Button
                  onClick={() => navigate(`/learner-page/${id}`)}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  Go to course
                </Button>
              ) : (
                <>
                  {/* <GooglePayButton
                    environment="TEST"
                    buttonSizeMode="static"
                    paymentRequest={{
                      apiVersion: 2,
                      apiVersionMinor: 0,
                      allowedPaymentMethods: [
                        {
                          type: "CARD",
                          parameters: {
                            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                            allowedCardNetworks: ["MASTERCARD", "VISA"],
                          },
                          tokenizationSpecification: {
                            type: "PAYMENT_GATEWAY",
                            parameters: {
                              gateway: "example",
                              gatewayMerchantId: "exampleMerchantId",
                            },
                          },
                        },
                      ],
                      merchantInfo: {
                        merchantId: "BCR2DN4T77KKF6YV",
                        merchantName: "Corporate Prism",
                      },
                      transactionInfo: {
                        totalPriceStatus: "FINAL",
                        totalPriceLabel: "Total",
                        totalPrice: course.price,
                        currencyCode: "PKR",
                        countryCode: "PK",
                      },
                    }}
                    onLoadPaymentData={(paymentData) => {
                      console.log(
                        "TO DO: Send order to server",
                        paymentData.paymentMethodData
                      );
                      navigate("/");
                    }}
                  /> */}
                  <BuyNowButton
                    courseId={id}
                    onEnrollmentSuccess={fetchCourse}
                  />
                </>
              )}
            </Card>
            <Card className="bg-white rounded-md mb-4 shadow-md p-6">
              <div className="mt-6">
                <h3 className="text-4xl font-semibold mb-4 ">
                  Course Information
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center gap-2  pt-4 pb-4">
                    <BsPerson className="text-gray-500" />
                    <span className=" font-medium  text-gray">Instructor:</span>
                    {course?.instructor?.name}
                  </li>
                  <li className="flex items-center gap-2 border-t-2 border-dashed pt-4 pb-4">
                    <LuBookText className="text-gray-500" />
                    <span className="font-medium text-gray"> Lessons:</span>
                    {course?.lessons?.length}
                  </li>
                  <li className="flex items-center gap-2 border-t-2 border-dashed pt-4 pb-4">
                    <BsClock className="text-gray-500" />
                    <span className="font-medium text-gray">Duration:</span>
                    {course?.duration}
                  </li>
                  <li className="flex items-center gap-2 border-t-2 border-dashed pt-4 pb-4">
                    <FaLevelUpAlt className="text-gray-500" />
                    <span className="font-medium text-gray">Level:</span>
                    {course?.courseLevel}
                  </li>
                  <li className="flex items-center gap-2 border-t-2 border-dashed pt-4 pb-4">
                    <IoLanguage className="text-gray-500" />
                    <span className="font-medium text-gray">
                      {" "}
                      Language:
                    </span>{" "}
                    {course?.language}
                  </li>
                  <li className="flex items-center gap-2 border-t-2 border-dashed pt-4 pb-4">
                    <SiTestcafe className="text-gray-500" />
                    <span className="font-medium text-gray">
                      {" "}
                      Quizzes:
                    </span>{" "}
                    {course.quizzes?.length}
                  </li>
                </ul>
              </div>
              <div className="mt-6 text-center">
                <button className="text-orange-500 bg-gray-100  p-4 rounded-md w-full font-bold">
                  Share This Course
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

const customStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;

export default CourseDetails;
