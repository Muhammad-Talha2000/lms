import axios from "axios";
import { API_V1_BASE } from "@/config/apiBase";

const API_URL = `${API_V1_BASE}/payment`;

const authHeaders = (token) =>
  token ? { Authorization: `Bearer ${token}` } : {};

/**
 * Creates a Stripe Checkout session; returns `{ url }` to redirect the browser.
 */
export const createCheckoutSession = async (paymentData, token) => {
  const response = await axios.post(
    `${API_URL}/create-checkout-session`,
    paymentData,
    { headers: { ...authHeaders(token), "Content-Type": "application/json" } }
  );
  return response.data;
};

/**
 * Verifies a completed Checkout session and enrolls the student (call after Stripe redirect).
 */
export const confirmStripeCheckoutSession = async (sessionId, token) => {
  const response = await axios.post(
    `${API_URL}/confirm-session`,
    { sessionId },
    { headers: { ...authHeaders(token), "Content-Type": "application/json" } }
  );
  return response.data;
};

/** @deprecated Use createCheckoutSession */
export const createPaymentIntent = createCheckoutSession;
