const RAZORPAY_API_URL = 'BACKEND_API_ENDPOINT';

// Mock function to simulate a successful API call for development
const mockCreateRazorpayOrder = async (planDetails) => {
  console.log('Using mock API call for development...');
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Return a mock success response with a unique order ID
  return { success: true, orderId: `order_ID${Math.random().toString(36).substr(2, 9)}` };
};

export const createRazorpayOrder = async (planDetails) => {
  const isProduction = false; // Change this to 'true' when your backend is ready

  if (isProduction) {
    try {
      const response = await fetch(RAZORPAY_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: planDetails.totalBill,
          planName: planDetails.name,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        return { success: true, orderId: data.orderId };
      } else {
        return { success: false, error: data.error || 'Failed to create order' };
      }
    } catch (error) {
      return { success: false, error: 'Network error or invalid response' };
    }
  } else {
    return await mockCreateRazorpayOrder(planDetails);
  }
};