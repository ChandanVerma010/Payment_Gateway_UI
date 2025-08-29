import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { cardPaymentStyles as styles } from '../StylesSheet/CardPayment.styles';
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

const isValidExpiry = (expiry: string) => {
  const [month, year] = expiry.split('/').map(s => parseInt(s, 10));
  if (!month || !year || month < 1 || month > 12) return false;
  const currentYear = new Date().getFullYear() % 100;
  if (year < currentYear || (year === currentYear && month < new Date().getMonth() + 1)) return false;
  return true;
};

export default function CardPayment() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
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
    if (cardNumber.replace(/\s/g, '').length !== 16 || isNaN(Number(cardNumber.replace(/\s/g, '')))) {
      Alert.alert('Invalid Card Number', 'Please enter a valid 16-digit card number.');
      return;
    }
    if (!isValidExpiry(expiry)) {
      Alert.alert('Invalid Expiry Date', 'Please enter a valid MM/YY expiry date.');
      return;
    }
    if (cvv.length !== 3 || isNaN(Number(cvv))) {
      Alert.alert('Invalid CVV', 'Please enter a valid 3-digit CVV.');
      return;
    }

    const orderRes = await createOrder();
    if (!orderRes.success || !orderRes.orderId) {
      Alert.alert('Order Failed', orderRes.error || 'Could not create a payment order.');
      return;
    }

    const options = {
      description: `Card payment for ${planDetails.name}`,
      currency: 'INR',
      key: 'RAZORPAY_KEY_ID', 
      amount: amountInPaise,
      name: 'Your Company Name',
      order_id: orderRes.orderId,
      method: 'card',
      card: { number: cardNumber, expiry: expiry, cvv: cvv },
      prefill: {
        email: 'customer@example.com',
        contact: '9999999999',
      },
    };

    Alert.alert(
      'Simulated Checkout',
      `Would open Razorpay for order ${orderRes.orderId} with card.`
    );
  }, [cardNumber, expiry, cvv, createOrder, amountInPaise, planDetails]);

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
        <Image
          source={require("../../assets/images/card.png")}
          style={styles.cardLogo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Pay via Card</Text>
        <Text style={styles.amountText}>Total: ₹{planDetails.totalBill.toFixed(2)}</Text>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Card Number"
            value={cardNumber}
            onChangeText={text => setCardNumber(text.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim())}
            keyboardType="numeric"
            maxLength={19}
          />
          <View style={styles.expiryCvvContainer}>
            <TextInput
              style={[styles.input, styles.expiryInput]}
              placeholder="MM/YY"
              value={expiry}
              onChangeText={text => setExpiry(text.replace(/[^0-9]/g, '').replace(/(\d{2})/, '$1/').slice(0, 5))}
              keyboardType="numeric"
              maxLength={5}
            />
            <TextInput
              style={[styles.input, styles.cvvInput]}
              placeholder="CVV"
              value={cvv}
              onChangeText={setCvv}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.payButton} onPress={handlePay}>
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}