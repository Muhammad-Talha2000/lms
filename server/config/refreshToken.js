import { google } from "googleapis";
import readline from "readline";
import fs from "fs";
import path from "path";

// Load credentials from credentials.json
const CREDENTIALS_PATH = path.resolve("credentials.json");
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));

// Extract credentials
const { client_id, client_secret, redirect_uris } =
  credentials.installed || credentials.web;

// Initialize OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
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
