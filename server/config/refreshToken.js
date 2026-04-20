import { google } from "googleapis";
import readline from "readline";
import dotenv from "dotenv";

dotenv.config();

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri =
  process.env.GOOGLE_REDIRECT_URI || process.env.FRONTEND_URL || "http://localhost:5173";

// Initialize OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

// Generate authorization URL
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
});

console.log("Authorize this app by visiting this URL:", authUrl);

// Create interface to receive input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Ask user to enter authorization code
rl.question("Enter the code from that page here: ", async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log("Your Refresh Token:", tokens.refresh_token);
    rl.close();
  } catch (error) {
    console.error("Error retrieving access token", error);
    rl.close();
  }
});
