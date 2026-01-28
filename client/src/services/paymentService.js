import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/payment";

// Create payment intent with AbhiPay
export const createPaymentIntent = async (paymentData) => {
  try {
    const response = await axios.post(`${API_URL}/pay`, paymentData);
    return response.data;
  } catch (error) {
    console.log("Error while creating payment intent", error);
  }
};

// // Verify payment status (optional - for additional verification)
// export const verifyPayment = async (paymentId, token) => {
//   try {
//     const response = await axios.get(`${API_URL}/verify/${paymentId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error.response?.data?.error ||
//         error.response?.data?.message ||
//         "Failed to verify payment"
//     );
//   }
// };

// export const processPayment = async (paymentData) => {
//   try {
//     const response = await axios.post(
//       "https://test-api.ahipay.com/transactions",
//       paymentData
//     );
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || "Payment failed");
//   }
// };

// export default {
//   createPaymentIntent,
//   verifyPayment,
// };
