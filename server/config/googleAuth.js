import { google } from "googleapis";
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri =
  process.env.GOOGLE_REDIRECT_URI || process.env.FRONTEND_URL || "http://localhost:5173";

// Use the Admin's refresh token (from .env file)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL; // Google Workspace Admin email
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);

// Set Admin's refresh token
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

/**
 * Get a fresh Google API access token using the Admin's account.
 */
export const getAccessToken = async () => {
  try {
    const { token } = await oAuth2Client.getAccessToken();
    return token;
  } catch (error) {
    console.error("Error getting Google access token:", error);
    throw error;
  }
};

/**
 * Get the authenticated OAuth2 client (for Admin account).
 */
export const getGoogleOAuthClient = async () => {
  return oAuth2Client;
};

/**
 * Get an authenticated Google Calendar instance using Admin's credentials.
 */
export const getGoogleCalendar = async () => {
  return google.calendar({ version: "v3", auth: oAuth2Client });
};

// import { google } from "googleapis";
// import { JWT } from "google-auth-library"; // Import JWT
// import fs from "fs";
// import path from "path";

// // Load service account credentials from JSON key file
// const CREDENTIALS_PATH = path.resolve("config", "service-account-file.json"); // Replace with your file path
// const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));

// /**
//  * Get an authenticated Google Calendar instance using the service account and impersonating the instructor.
//  */
// export const getGoogleCalendar = async () => {
//   try {
//     const client = new JWT({
//       email: credentials.client_email,
//       key: credentials.private_key,
//       scopes: ["https://www.googleapis.com/auth/calendar"],
//       subject: process.env.GOOGLE_ADMIN_EMAIL,
//     });

//     await client.authorize();

//     return google.calendar({ version: "v3", auth: client });
//   } catch (error) {
//     console.error("Error getting Google Calendar:", error.message);
//     throw error;
//   }
// };
