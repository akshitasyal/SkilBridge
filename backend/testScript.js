import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: "rzp_test_SfTsspodEYJUAa",
  key_secret: "6HfAQTBKCEy2dHSS1qbzzKir"
});

async function test() {
  try {
    const rzpOrder = await razorpay.orders.create({
      amount: 50000,
      currency: "INR",
      receipt: "receipt_order_test"
    });
    console.log("SUCCESS:", rzpOrder);
  } catch (error) {
    console.log("ERROR IS GIVEN BELOW");
    console.error(error);
  }
}

test();
