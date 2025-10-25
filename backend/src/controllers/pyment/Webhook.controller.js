import axios from "axios";

export const webhookController = async (req, res) => {
  try {
    const { amount, orderId, email } = req.body;

    console.log("Starting payment init:", { amount, orderId, email });

    const response = await axios.post(
      "https://sandbox.api.getsafepay.com/order/v1/init",
      {
        amount: amount * 100,      // in paisa
        currency: "PKR",
        order_id: orderId,
        source: "custom",
        email,
        client: process.env.SAFEPAY_API_KEY,      // required
        environment: "sandbox",                   // required
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SAFEPAY_SECRET}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log("Safepay response:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Safepay error:", error.response?.data || error.message);
    res.status(500).json({ error: "Payment initialization failed" });
  }
};
