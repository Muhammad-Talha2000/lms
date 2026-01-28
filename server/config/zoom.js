import axios from "axios";

const config = {
  accountId: process.env.ZOOM_ACCOUNT_ID,
  clientId: process.env.ZOOM_CLIENT_ID,
  clientSecret: process.env.ZOOM_CLIENT_SECRET,
  baseUrl: "https://api.zoom.us/v2",
};

// Get OAuth token
export const getZoomAccessToken = async () => {
  const tokenUrl = "https://zoom.us/oauth/token";

  const params = new URLSearchParams();
  params.append("grant_type", "account_credentials");
  params.append("account_id", config.accountId);

  try {
    const response = await axios.post(tokenUrl, params, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${config.clientId}:${config.clientSecret}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error getting Zoom access token:",
      error.response?.data || error
    );
    throw error;
  }
};
