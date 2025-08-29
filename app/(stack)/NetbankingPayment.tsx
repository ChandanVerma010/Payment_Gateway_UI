import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import RazorpayCheckout from 'react-native-razorpay';
import { netbankingPaymentStyles as styles } from '../StylesSheet/NetbankingPayment.styles.js';
import { createRazorpayOrder as mockCreateRazorpayOrder } from '../api.js';

interface PlanDetails {
  name: string;
  totalBill: number;
  orderId?: string;
}

interface RazorpayOrderResponse {
  success: boolean;
  orderId?: string;
  error?: string;
}

const MOCK_PLAN_DETAILS: PlanDetails = {
  totalBill: 1716.0,
  name: 'Java Subscription',
};

const banks = [
  'HDFC Bank',
  'ICICI Bank',
  'State Bank of India',
  'Axis Bank',
  'Kotak Mahindra Bank',
];

export default function NetbankingPayment() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const [selectedBank, setSelectedBank] = useState(banks[0]);
  const [loading, setLoading] = useState(false);

  const planDetails: PlanDetails = useMemo(() => {
    const raw = params?.selectedPlanDetails;
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        return {
          totalBill: parsed.totalBill ?? MOCK_PLAN_DETAILS.totalBill,
          name: parsed.name ?? MOCK_PLAN_DETAILS.name,
        };
      } catch {
        return MOCK_PLAN_DETAILS;
      }
    }
    return MOCK_PLAN_DETAILS;
  }, [params.selectedPlanDetails]);

  const amountInPaise = useMemo(() => Math.round(planDetails.totalBill * 100), [planDetails.totalBill]);

  const createOrder = useCallback(async (): Promise<RazorpayOrderResponse> => {
    setLoading(true);
    try {
      const isProduction = false; // Set to true for production
      const resp = isProduction
        ? // Replace with real API call
          { success: false, error: 'Real API not implemented' }
        : await mockCreateRazorpayOrder(planDetails);

      if (resp?.success && resp.orderId) {
        return { success: true, orderId: resp.orderId };
      }
      return { success: false, error: resp?.error || 'Failed to create order' };
    } catch (err) {
      console.error('createOrder error', err);
      return { success: false, error: 'Network error or server error' };
    } finally {
      setLoading(false);
    }
  }, [planDetails]);

  const handlePay = useCallback(async () => {
    const orderRes = await createOrder();
    if (!orderRes.success || !orderRes.orderId) {
      Alert.alert('Order Failed', orderRes.error || 'Could not create a payment order.');
      return;
    }

    const options = {
      description: `Netbanking payment for ${planDetails.name}`,
      currency: 'INR',
      key: 'RAZORPAY_KEY_ID',
      amount: amountInPaise,
      name: 'Your Company Name',
      order_id: orderRes.orderId,
      method: 'netbanking',
      bank: selectedBank.toLowerCase().replace(/\s/g, ''),
      prefill: {
        email: 'customer@example.com',
        contact: '9999999999',
      },
    };

    Alert.alert(
      'Simulated Checkout',
      `Would open Razorpay for order ${orderRes.orderId} with ${selectedBank}.`
    );
  }, [selectedBank, createOrder, amountInPaise, planDetails]);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#E7613C" />
        <Text style={styles.loadingText}>Creating order...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headerTitle}>Pay via Netbanking</Text>
        <Text style={styles.amountText}>Total: ₹{planDetails.totalBill.toFixed(2)}</Text>
        <Image
          source={require("../../assets/images/netbanking.png")}
          style={styles.netbankingLogo}
          resizeMode="contain"
        />
        <Picker
          selectedValue={selectedBank}
          style={styles.bankPicker}
          onValueChange={(itemValue) => setSelectedBank(itemValue)}
        >
          {banks.map(bank => (
            <Picker.Item key={bank} label={bank} value={bank} />
          ))}
        </Picker>
        <TouchableOpacity style={styles.payButton} onPress={handlePay}>
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}