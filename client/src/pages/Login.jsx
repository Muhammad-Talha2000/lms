import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LuBookText } from "react-icons/lu";
import { BsPerson } from "react-icons/bs";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { TfiEmail } from "react-icons/tfi";
import { IoIosPhonePortrait } from "react-icons/io";
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import { login } from "../services/authService";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoggedinUser, setSignupData } from "@/redux/authSlice";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";
// import { toast } from "react-toastify";

const RoleSelection = ({ selectedRole, onRoleSelect }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-2xl font-bold text-center text-orange-500">
        Choose Your Role
      </CardTitle>
      <CardDescription className="text-center">
        Select how you want to join our platform
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Button
          className={`h-32 flex flex-col items-center justify-center space-y-2 ${
            selectedRole === "student"
              ? "bg-orange-500"
              : "bg-orange-50 hover:bg-orange-100 text-orange-500"
          }`}
          onClick={() => onRoleSelect("student")}
        >
          <FaUserGraduate className="w-8 h-8" />
          <span className="text-lg">Student</span>
        </Button>
        <Button
          className={`h-32 flex flex-col items-center justify-center space-y-2 ${
            selectedRole === "instructor"
              ? "bg-orange-500"
              : "bg-orange-50 hover:bg-orange-100 text-orange-500"
          }`}
          onClick={() => onRoleSelect("instructor")}
        >
          <FaChalkboardTeacher className="w-8 h-8" />
          <span className="text-lg">Instructor</span>
        </Button>
      </div>
    </CardContent>
  </Card>
);

const RegistrationForm = ({
  selectedRole,
  signUpInput,
  onInputChange,
  onSubmit,
  onBack,
  loading,
  isOTPSent,
  otp,
  setOtp,
  handleVerifyOTP,
  isTimerActive,
  otpTimer,
  visible,
  setVisible,
}) => (
  <Card>
    {!isOTPSent ? (
      <>
        <CardHeader>
          <CardTitle className="font-bold">
            Sign Up as{" "}
            {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
          </CardTitle>
          <Button
            variant="ghost"
            className="text-sm text-gray-500"
            onClick={onBack}
          >
            ← Change Role
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Input
                name="first_name"
                value={signUpInput.first_name}
                onChange={onInputChange}
                placeholder="First Name"
              />
              <BsPerson className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="relative">
              <Input
                name="last_name"
                value={signUpInput.last_name}
                onChange={onInputChange}
                placeholder="Last Name"
              />
              <BsPerson className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Input
                name="email"
                type="email"
                value={signUpInput.email}
                onChange={onInputChange}
                placeholder="Email"
              />
              <TfiEmail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="relative">
              <Input
                name="phone"
                type="tel"
                value={signUpInput.phone}
                onChange={onInputChange}
                placeholder="Phone Number"
              />
              <IoIosPhonePortrait className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {selectedRole === "instructor" && (
            <div className="space-y-4">
              <div className="relative">
                <Input
                  name="qualification"
                  value={signUpInput.qualification}
                  onChange={onInputChange}
                  placeholder="Highest Qualification"
                />
                <MdSchool className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="relative">
                <Input
                  name="teaching_experience"
                  value={signUpInput.teaching_experience}
                  onChange={onInputChange}
                  placeholder="Teaching Experience (in years)"
                  type="number"
                />
              </div>
              <div className="relative">
                <Input
                  name="subjects"
                  value={signUpInput.subjects}
                  onChange={onInputChange}
                  placeholder="Subjects (comma-separated)"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Input
                name="password"
                type={visible ? "text" : "password"}
                value={signUpInput.password}
                onChange={onInputChange}
                placeholder="Password"
              />
              {/* <IoEyeOffOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
              <button
                type="button"
                onClick={() => setVisible(!visible)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
              >
                {visible ? (
                  <IoEyeOutline className="text-orange-500" />
                ) : (
                  <IoEyeOffOutline />
                )}
              </button>
            </div>
            <div className="relative">
              <Input
                name="confirm_password"
                type={visible ? "text" : "password"}
                value={signUpInput.confirm_password}
                onChange={onInputChange}
                placeholder="Confirm Password"
              />
              {/* <IoEyeOffOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
              <button
                type="button"
                onClick={() => setVisible(!visible)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
              >
                {visible ? (
                  <IoEyeOutline className="text-orange-500" />
                ) : (
                  <IoEyeOffOutline />
                )}
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? "Processing..." : "Continue to Profile Setup"}
          </Button>
        </CardFooter>
      </>
    ) : (
      <>
        <h3 className="text-lg text-orange-500 text-center mt-8 mb-2 font-bold">
          Enter OTP
        </h3>
        <p className="text-center text-gray-500 mb-4">
          Enter the 6-digit OTP sent to your email
        </p>

        <div className="flex justify-center gap-2 mb-5 text-gray-500">
          <InputOTP
            className="items-center"
            maxLength={6}
            value={otp}
            onChange={setOtp}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="text-center text-gray-500 mb-4">
          {isTimerActive ? (
            <p className="flex justify-center gap-2">
              <Loader2 className="animate-spin text-orange-500" /> Resend OTP in{" "}
              {"  "}
              <span className="font-bold text-orange-500">{otpTimer}s</span>
            </p>
          ) : (
            <Button
              variant="link"
              onClick={onSubmit}
              className="text-orange-500 "
            >
              RESEND OTP
            </Button>
          )}
        </div>
        <Button
          className="w-full bg-orange-500 hover:bg-orange-600"
          onClick={handleVerifyOTP}
          disabled={loading}
        >
          {/* {loading ? "Verifying..." : "Verify & Contineue "} */}
          {loading ? "Processing..." : "Verify to Profile Setup"}
        </Button>
      </>
    )}
  </Card>
);

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [registrationStep, setRegistrationStep] = useState("role");
  const [selectedRole, setSelectedRole] = useState(null);
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [signUpInput, setSignUpInput] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    qualification: "",
    teaching_experience: "",
    subjects: "",
  });

  const [isOTPSent, setIsOTPSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(60); // Timer set to 60 seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [attempts, setAttempts] = useState(0);
  const [visible, setVisible] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setSignUpInput((prev) => ({ ...prev, role }));
    setRegistrationStep("details");
  };

  // login form submit

  // const handleSubmit = async (e, type) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     if (type === "Signup") {
  //       const { confirm_password, first_name, last_name, phone, ...userData } =
  //         signUpInput;
  //       const name = `${first_name} ${last_name}`;

  //       if (userData.password !== confirm_password) {
  //         toast({
  //           title: "Error",
  //           description: "Passwords do not match",
  //           className: "bg-red-500 text-white",
  //         });
  //         setLoading(false);
  //         return;
  //       }

  //       const finalUserData = { ...userData, name, mobile: phone };

  //       dispatch(setSignupData(finalUserData));
  //       // navigate("/personal-details");
  //     } else {
  //       const response = await login(loginInput);
  //       dispatch(setLoggedinUser(response));

  //       const navigationPaths = {
  //         student: "/profile",
  //         instructor: "/instructordashboard",
  //         default: "/admin",
  //       };

  //       navigate(
  //         navigationPaths[response?.user?.role] || navigationPaths.default
  //       );

  //       toast({
  //         title: "Success!",
  //         description: "Logged in successfully",
  //         className: "bg-green-500 text-white",
  //       });
  //     }
  //   } catch (err) {
  //     toast({
  //       title: "Error!",
  //       description: err.message || "Something went wrong",
  //       className: "bg-red-500 text-white",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === "Signup") {
        const { confirm_password, first_name, last_name, phone, ...userData } =
          signUpInput;
        const name = `${first_name} ${last_name}`;
        if (
          !first_name ||
          !last_name ||
          !userData.email ||
          !phone ||
          !userData.password ||
          !confirm_password
        ) {
          toast({
            title: "Error",
            description: "All fields are required",
            className: "bg-red-500 text-white",
          });
          setLoading(false);
          return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
          toast({
            title: "Error",
            description: "Invalid email format",
            className: "bg-red-500 text-white",
          });
          setLoading(false);
          return;
        }

        // Validate phone number (assuming 10-digit number)
        const phoneRegex = /^[0-9]{11}$/;
        if (!phoneRegex.test(phone)) {
          toast({
            title: "Error",
            description: "Invalid phone number! Must be 11 digits.",
            className: "bg-red-500 text-white",
          });
          setLoading(false);
          return;
        }

        // Validate password strength
        if (userData.password.length < 6) {
          toast({
            title: "Error",
            description: "Password must be at least 6 characters long!",
            className: "bg-red-500 text-white",
          });
          setLoading(false);
          return;
        }

        // Check if passwords match
        if (userData.password !== confirm_password) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            className: "bg-red-500 text-white",
          });
          setLoading(false);
          return;
        }

        console.log(signUpInput);

        if (
          !first_name ||
          !last_name ||
          !phone ||
          !userData.email ||
          !userData.password ||
          !userData.role ||
          (userData.role === "instructor" &&
            (!userData.subjects ||
              !userData.teaching_experience ||
              !userData.qualification))
        ) {
          toast({
            title: "Error",
            description: "Please fill in all the fields first",
            className: "bg-yellow-500 text-white",
          });
          setLoading(false);
          return;
        }

        if (userData.password !== confirm_password) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            className: "bg-red-500 text-white",
          });
          setLoading(false);
          return;
        }

        const finalUserData = { ...userData, name, mobile: phone };
        console.log(finalUserData);

        dispatch(setSignupData(finalUserData));
        // navigate("/personal-details");
      } else {
        const response = await login(loginInput);
        dispatch(setLoggedinUser(response));

        const navigationPaths = {
          student: "/profile",
          instructor: "/instructordashboard",
          default: "/admin",
        };

        navigate(
          navigationPaths[response?.user?.role] || navigationPaths.default
        );

        toast({
          title: "Success!",
          description: "Logged in successfully",
          className: "bg-green-500 text-white",
        });
      }
    } catch (err) {
      toast({
        title: "Error!",
        description: err.message || "Something went wrong",
        className: "bg-red-500 text-white",
      });
    } finally {
      setLoading(false);
    }
  };

  // enter key press for login
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e, "Login"); // Trigger login on Enter key press
    }
  };

  //   const changeInputHandler = (e) => {
  //     const { name, value } = e.target;
  //     setSignUpInput((prev) => ({ ...prev, [name]: value }));
  //   };

  const changeInputHandler = (e) => {
    const { name, value } = e.target;
    setSignUpInput((prev) => ({ ...prev, [name]: value }));
  };

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // const {
      //   first_name,
      //   last_name,
      //   email,
      //   phone,
      //   password,
      //   confirm_password,
      // } = signUpInput;
      const { confirm_password, first_name, last_name, phone, ...userData } =
        signUpInput;

      // Validation Checks
      if (
        !first_name ||
        !last_name ||
        !userData.email ||
        !phone ||
        !userData.password ||
        !confirm_password
      ) {
        toast({
          title: "Error",
          description: "All fields are required",
          className: "bg-red-500 text-white",
        });
        setLoading(false);
        return;
      }

      // Validate Name

      // ✅ Name Field Validation
      if (!first_name.trim() || !last_name.trim()) {
        toast({
          title: "Error",
          description: "First Name and Last Name are required",
          className: "bg-red-500 text-white",
        });
        setLoading(false);
        return;
      }
      if (first_name.trim().length < 3 || last_name.trim().length < 3) {
        toast({
          title: "Error",
          description:
            "First Name and Last Name must be at least 3 characters long",
          className: "bg-red-500 text-white",
        });
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        toast({
          title: "Error",
          description: "Invalid email format",
          className: "bg-red-500 text-white",
        });
        setLoading(false);
        return;
      }

      // Validate phone number (assuming 10-digit number)
      const phoneRegex = /^[0-9]{11}$/;
      if (!phoneRegex.test(phone)) {
        toast({
          title: "Error",
          description: "Invalid phone number! Must be 11 digits.",
          className: "bg-red-500 text-white",
        });
        setLoading(false);
        return;
      }

      // Validate password strength
      if (userData.password.length < 6) {
        toast({
          title: "Error",
          description: "Password must be at least 6 characters long!",
          className: "bg-red-500 text-white",
        });
        setLoading(false);
        return;
      }

      // Check if passwords match
      if (userData.password !== confirm_password) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          className: "bg-red-500 text-white",
        });
        setLoading(false);
        return;
      }

      const res = await handleSubmit(e, "Signup");
      console.log(res);

      const response = await axios.post("http://localhost:5000/api/v1/otp", {
        email: signUpInput.email,
      });

      // if (response.data.success) {
      //   setIsOTPSent(true);
      //   alert("OTP sent to your email!");
      // }
      if (response.data.success) {
        setIsOTPSent(true);
        setIsTimerActive(true);
        setOtpTimer(60); // Reset Timer
        startTimer(); // Start Timer Function
        console.log("OTP sent to your email!");
      }
      // toast.success("OTP sent successfully! Check your email.");

      toast({
        title: "Success!",
        description: "OTP sent successfully! Check your email.",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      // toast.error(error.response?.data?.message || "Failed to send OTP");
      toast({
        title: "Error",
        description: "Failed to send OTP",
        className: "bg-red-500 text-white",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Login
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast({
        title: "Error",
        description: "OTP field cannot be empty.",
        className: "bg-red-500 text-white",
      });
      return;
    }
    setLoading(true);
    if (attempts >= 5) {
      toast({
        title: "Error",
        description: "Too many failed attempts. Try again later.",
        className: "bg-red-500 text-white",
      });
      return;
    }
    try {
      console.log(otp, signUpInput.email);
      const response = await axios.post(
        "http://localhost:5000/api/v1/otp/verify-otp",
        {
          email: signUpInput.email,
          code: otp,
        }
      );

      // console.log(response);

      if (response.data.success) {
        // await handleSubmit(e, "Signup");
        navigate("/personal-details");
      }
      // toast.success("OTP Verified! Proceeding...");

      toast({
        title: "Success!",
        description: "OTP Verified! Proceeding...",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      if (error.response) {
        // The request was made, and the server responded with a status code
        // console.log("Error verifying OTP: ", error.response.data.message);
        // alert(error.response.data.message); // Show user-friendly error
        setAttempts(attempts + 1);
        // toast.error(error.response.data.message || "Invalid OTP");
        toast({
          title: "Error",
          description: "Invalid OTP",
          className: "bg-red-500 text-white",
        });
      } else if (error.request) {
        // The request was made but no response was received
        console.log("No response received from server.");
        alert("Server is not responding. Please try again later.");
        toast({
          title: "Error",
          description: "No Response Recieved From Server",
          className: "bg-red-500 text-white",
        });
      } else {
        // Something else happened
        console.log("Error verifying OTP: ", error.message);
        alert("An unexpected error occurred. Please try again.");
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          className: "bg-red-500 text-white",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // timmer for otp

  const startTimer = () => {
    let time = 60;
    setOtpTimer(time);

    const interval = setInterval(() => {
      time -= 1;
      setOtpTimer(time);

      if (time === 0) {
        clearInterval(interval);
        setIsTimerActive(false); // Enable Resend OTP
      }
    }, 1000);

    console.log("timer is start", interval);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="uppercase font-bold text-xl absolute top-2 left-3">
        SMARTFLOW<span className="text-orange-500">LMS</span>
      </h1>
      <Tabs
        defaultValue="register"
        className="w-full max-w-[600px]"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="register"
            className={`transition-colors duration-500 ${
              activeTab === "register"
                ? "text-white bg-orange-500"
                : "text-gray-500"
            }`}
          >
            <LuBookText className="mr-2" /> Register
          </TabsTrigger>
          <TabsTrigger
            value="login"
            className={`transition-colors duration-500 ${
              activeTab === "login"
                ? "text-white bg-orange-500"
                : "text-gray-500"
            }`}
          >
            <BsPerson className="mr-2" /> Login
          </TabsTrigger>
        </TabsList>

        <TabsContent value="register">
          {registrationStep === "role" ? (
            <RoleSelection
              selectedRole={selectedRole}
              onRoleSelect={handleRoleSelect}
            />
          ) : (
            <RegistrationForm
              selectedRole={selectedRole}
              signUpInput={signUpInput}
              isOTPSent={isOTPSent}
              otp={otp}
              onInputChange={changeInputHandler}
              setOtp={setOtp}
              handleVerifyOTP={handleVerifyOTP}
              //   onSubmit={(e) => handleSubmit(e, "Signup")}
              onSubmit={handleSendOTP}
              loading={loading}
              onBack={() => setRegistrationStep("role")}
              isTimerActive={isTimerActive}
              otpTimer={otpTimer}
              visible={visible}
              setVisible={setVisible}
            />
          )}
        </TabsContent>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle className="font-bold">Login</CardTitle>
            </CardHeader>

            <>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={loginInput.email}
                      onChange={(e) =>
                        setLoginInput((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="Enter your email"
                    />
                    <BsPerson className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      // type="password"
                      type={visible ? "text" : "password"}
                      value={loginInput.password}
                      onChange={(e) =>
                        setLoginInput((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      placeholder="Enter your password"
                      onKeyDown={handleKeyDown}
                    />
                    {/* <IoEyeOffOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
                    <button
                      type="button"
                      onClick={() => setVisible(!visible)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
                    >
                      {visible ? (
                        <IoEyeOutline className="text-orange-500" />
                      ) : (
                        <IoEyeOffOutline />
                      )}
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full space-y-4">
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    onClick={(e) => handleSubmit(e, "Login")}
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                  {/* <Button
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    onClick={handleSendOTP}
                    disabled={loading}
                  >
                    {loading ? "Sending OTP..." : "Login"}

                  </Button> */}
                  <Button
                    variant
                    onClick={() => {
                      navigate("/forgotPassword");
                    }}
                    className="w-full text-orange-500 text-xs"
                  >
                    Forgot Password?
                  </Button>
                </div>
              </CardFooter>
            </>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
