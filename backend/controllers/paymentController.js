import Razorpay from "razorpay";
import crypto from "crypto";
import prisma from "../config/db.js";

// Strip potential accidental quotes from dashboard copy-pastes
const RZP_ID = (process.env.RAZORPAY_KEY_ID || "rzp_test_SfTsspodEYJUAa").replace(/["']/g, "").trim();
const RZP_SECRET = (process.env.RAZORPAY_KEY_SECRET || "6HfAQTBKCEy2dHSS1qbzzKir").replace(/["']/g, "").trim();

// Initialize Razorpay securely evaluating local keys
const razorpay = new Razorpay({
  key_id: RZP_ID,
  key_secret: RZP_SECRET
});

// POST /api/payment/create-order
export const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.userId;

    if (!orderId) return res.status(400).json({ error: "Order Identification required." });

    // Fetch bounding order verifying caller ownership ensuring they aren't paying for arbitrary entries
    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
    });

    if (!order || order.buyerId !== userId) {
      return res.status(404).json({ error: "Active payment obligation not found." });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ error: "Target obligation is completely satisfied." });
    }

    // Force strict conversion onto integer paisa values bounding precision faults
    const amountInPaisa = Math.round(order.price * 100);

    const rzpOptions = {
      amount: amountInPaisa,
      currency: "INR", // Changed to INR for Razorpay India
      receipt: `receipt_order_${order.id}`
    };

    const rzpOrder = await razorpay.orders.create(rzpOptions);

    res.json({
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      key: RZP_ID
    });

  } catch (error) {
    console.error("Razorpay Generation Error:", error);
    
    // Safely extract Razorpay error description if available
    let errorMsg = "Failed to dispatch active checkout bounds.";
    if (error && error.error && error.error.description) {
      errorMsg = error.error.description;
    } else if (error && error.message) {
      errorMsg = error.message;
    } else if (typeof error === 'string') {
      errorMsg = error;
    }

    res.status(500).json({ error: errorMsg });
  }
};

// POST /api/payment/verify
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({ error: "Missing webhook validation headers." });
    }

    const secret = RZP_SECRET;

    // 1. Forge native Cryptographic expected evaluation binding the strings
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // 2. Validate generic outputs matching identical payload streams safely avoiding impersonation
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid integrity signature preventing resolution." });
    }

    // 3. Complete binding marking transaction globally true
    await prisma.order.update({
      where: { id: Number(orderId) },
      data: {
        status: "completed",
        paymentId: razorpay_payment_id
      }
    });

    res.json({ message: "Checkout verified accurately resolving logic chain." });
  } catch (error) {
    console.error("Razorpay Security Verification Error:", error);
    res.status(500).json({ error: "Failed to analyze structural checkouts." });
  }
};
