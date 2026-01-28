import axios from "axios";
import moment from "moment"; // npm install moment

const PAY_PRO_URL = process.env.PAY_PRO_API_URL;

const generateToken = async () => {
  const response = await axios.post(`${PAY_PRO_URL}/auth`, {
    clientid: process.env.PAY_PRO_CLIENT_ID,
    clientsecret: process.env.PAY_PRO_CLIENT_SECRET,
  });
  const token = response.headers["token"];
  return token;
};

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, userId, courseId, email, phone, username, address } =
      req.body;
    const token = await generateToken();

    console.log(amount, userId, courseId, email, phone, username, address);
    console.log(token);

    // Convert dates to DD/MM/YYYY format
    const issueDate = moment().format("DD/MM/YYYY");
    const dueDate = moment().add(1, "day").format("DD/MM/YYYY");

    const paymentData = [
      {
        MerchantId: "Corporate_Prism",
      },
      {
        OrderNumber: `${userId}-${courseId}`,
        OrderAmount: amount,
        OrderDueDate: dueDate,
        OrderType: "Service",
        IssueDate: issueDate,
        OrderExpireAfterSeconds: "0",
        CustomerName: username,
        CustomerMobile: phone,
        CustomerEmail: email,
        CustomerAddress: address,
      },
    ];

    const response = await axios.post(`${PAY_PRO_URL}/co`, paymentData, {
      headers: {
        Token: token,
      },
    });
    // console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Payment initiation failed" });
  }
};
