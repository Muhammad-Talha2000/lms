import { useState, useEffect } from "react";
import axios from "axios";

const useOTPHandler = (email) => {
  const [otp, setOtp] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    let timer;
    if (isOTPSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsResendDisabled(false);
    }

    return () => clearInterval(timer);
  }, [isOTPSent, countdown]);

  const handleSendOTP = async () => {
    if (!email) {
      setErrorMessage("Please enter your email first.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/v1/otp", {
        email,
      });

      if (response.data.success) {
        setIsOTPSent(true);
        setCountdown(60);
        setIsResendDisabled(true);
        setSuccessMessage("OTP sent successfully! Check your email.");
      } else {
        setErrorMessage("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Error sending OTP: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/otp/verify-otp",
        {
          email,
          code: otp,
        }
      );

      if (response.data.success) {
        setSuccessMessage("OTP verified successfully! Redirecting...");
      } else {
        setErrorMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Error verifying OTP: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // const handleVerifyOTP = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setErrorMessage("");
  //   setSuccessMessage("");

  //   if (!otp || otp.length < 6) {
  //     console.log("otppppp errrror", otp);
  //     console.log("eor meg", errorMessage);
  //     setErrorMessage("Please enter the OTP code.");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(
  //       "http://localhost:5000/api/v1/otp/verify-otp",
  //       {
  //         email,
  //         code: otp,
  //       }
  //     );

  //     if (response.data.success) {
  //       setSuccessMessage("OTP verified successfully! Redirecting...");
  //     }
  //   } catch (error) {
  //     // Extract error message from backend response
  //     if (
  //       error.response &&
  //       error.response.data &&
  //       error.response.data.message
  //     ) {
  //       setErrorMessage(error.response.data.message);
  //     } else {
  //       setErrorMessage("An unexpected error occurred. Please try again.");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return {
    otp,
    setOtp,
    isOTPSent,
    loading,
    errorMessage,
    successMessage,
    countdown,
    isResendDisabled,
    handleSendOTP,
    handleVerifyOTP,
  };
};

export default useOTPHandler;
