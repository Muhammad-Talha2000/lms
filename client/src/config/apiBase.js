/** Matches server mount: /api/v1 */
export const API_V1_BASE = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api/v1"
).replace(/\/$/, "");

/** Useful for non-versioned backend routes like /send-email */
export const API_ORIGIN = API_V1_BASE.replace(/\/api\/v1$/, "");
