// // components/ResetPassword.jsx
// import React, { useState } from "react";
// import { useParams } from "react-router-dom";

// const ResetPassword = () => {
//   const { token } = useParams(); // Assumes your route is defined as /reset-password/:token
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const { id } = useParams();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     try {
//       const res = await fetch(
//         "http://localhost:5000/api/v1/password/reset-password",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ token: id, password }), // `id` must match the backend token
//         }
//       );
//       const data = await res.json();
//       if (res.ok) {
//         setMessage(data.message);
//       } else {
//         setError(data.message || "An error occurred");
//       }
//     } catch (err) {
//       setError("An error occurred");
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
//       {message && <p className="mb-4 text-green-600">{message}</p>}
//       {error && <p className="mb-4 text-red-600">{error}</p>}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="flex flex-col">
//           <label htmlFor="password" className="mb-1">
//             New Password
//           </label>
//           <input
//             type="password"
//             id="password"
//             className="border rounded px-3 py-2"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <div className="flex flex-col">
//           <label htmlFor="confirmPassword" className="mb-1">
//             Confirm New Password
//           </label>
//           <input
//             type="password"
//             id="confirmPassword"
//             className="border rounded px-3 py-2"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
//         >
//           Reset Password
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;

import { Button } from "@radix-ui/themes";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { id } = useParams(); // Get the token from the URL
  const navigate = useNavigate(); // Hook to navigate to another page

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/v1/password/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: id, password }), // Send the token from URL
        }
      );
      const data = await res.json();

      if (res.ok) {
        setMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login"); // Redirect to login page after 3 seconds
        }, 3000);
      } else {
        setError(data.message || "An error occurred");
      }
    } catch (err) {
      setError("An error occurred");
    }
  };

  return (
    // <div className="container mx-auto p-4">
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-96">
        <h2 className="text-4xl text-center text-orange-500 font-bold mb-4">
          Reset Password
        </h2>
        {message && <p className="mb-4 text-green-600">{message}</p>}
        {error && <p className="mb-4 text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1">
              New Password
            </label>
            <input
              type="password"
              id="password"
              className="border rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="border rounded px-3 py-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="bg-orange-500 text-white rounded px-4 py-2 hover:bg-orange-600"
          >
            Reset Password
          </Button>
        </form>

        {/* Add a button to manually go to login */}
        {message && (
          <Button
            varriant="link"
            onClick={() => navigate("/login")}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Go to Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
