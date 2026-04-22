import { createRazorpayOrder, verifyRazorpayPayment } from "../api/payment";

export const handlePayment = async (orderId, token, onSuccess) => {
  try {
    // 1. Create order tracking bounds safely across backend configs
    const rzpData = await createRazorpayOrder(orderId, token);

    // 2. Launch Native Gateway bounds
    const options = {
      key: rzpData.key,
      amount: rzpData.amount,
      currency: "INR",
      name: "SkillBridge Marketplace",
      description: `Fulfillment for Order #${orderId}`,
      order_id: rzpData.razorpayOrderId,
      handler: async function (response) {
        try {
          // 3. Complete structural binds tracking success tokens
          await verifyRazorpayPayment({
             razorpay_order_id: response.razorpay_order_id,
             razorpay_payment_id: response.razorpay_payment_id,
             razorpay_signature: response.razorpay_signature,
             orderId
          }, token);

          alert("Checkout verified successfully!");
          
          if (onSuccess) {
            onSuccess();
          }
        } catch (err) {
          alert(err.message);
        }
      },
      theme: { color: "#1dbf73" }
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.on("payment.failed", function (response) {
      alert(response.error.description);
    });
    razorpayInstance.open();

  } catch (err) {
    alert(err.message);
  }
};
