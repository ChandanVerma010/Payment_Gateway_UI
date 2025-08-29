import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from '../StylesSheet/AuthRazor.styles.js';
import { createRazorpayOrder } from '../api.js';

interface PlanDetails {
  name: string;
  totalBill: number | string; // handle both
  [key: string]: any;
}

interface RazorpayOrderResponse {
  success: boolean;
  orderId?: string;
  error?: string;
}

export default function AuthRazorpay() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const [details, setDetails] = useState<PlanDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cancelledRef = useRef<boolean>(false);

  // Parse plan details from params
  useEffect(() => {
    const raw = params?.selectedPlanDetails;
    if (typeof raw === 'string') {
      try {
        const parsedDetails = JSON.parse(raw) as PlanDetails;
        setDetails(parsedDetails);
        setLoading(false); // stop loader once parsed
      } catch (e) {
        console.error('Failed to parse selectedPlanDetails:', e);
        setDetails(null);
        setError('Invalid payment details received.');
        setLoading(false);
      }
    } else {
      setDetails(null);
      setError('No payment details provided.');
      setLoading(false);
    }
  }, [params.selectedPlanDetails]);

  // Fetch order ID
  useEffect(() => {
    const fetchOrderId = async () => {
      if (!details || !details.totalBill || !details.name) {
        setError('Invalid or missing payment details. Please go back and reselect your plan.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      cancelledRef.current = false;

      try {
        const response: RazorpayOrderResponse = await createRazorpayOrder(details);

        if (cancelledRef.current) return;

        if (response?.success && response?.orderId) {
          setOrderId(response.orderId);
        } else {
          setError(response?.error || 'Failed to create Razorpay order. Please try again.');
        }
      } catch (err) {
        console.error('Order creation failed:', err);
        if (!cancelledRef.current) {
          setError('Network error while creating order. Please check your internet connection.');
        }
      } finally {
        if (!cancelledRef.current) setLoading(false);
      }
    };

    if (details) {
      fetchOrderId();
    }

    return () => {
      cancelledRef.current = true;
    };
  }, [details]);

  const handleProceedToPayment = () => {
    if (!orderId) {
      Alert.alert('Error', 'Order ID not available. Please try again.');
      return;
    }

    const params = `orderId=${encodeURIComponent(orderId)}&selectedPlanDetails=${encodeURIComponent(JSON.stringify(details))}`;
    router.push('/(stack)/PaymentOption?' + params);
  };

  const handleCancelPayment = () => {
    Alert.alert('Cancel Payment', 'Are you sure you want to cancel the payment?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          cancelledRef.current = true;
          router.back();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#E7613C" />
        <Text style={{ marginTop: 10, color: 'white' }}>Authorizing Payment...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={{ color: 'red', fontSize: 16, textAlign: 'center', marginBottom: 10 }}>
          {error}
        </Text>
        <TouchableOpacity
          style={[styles.proceedButton, { backgroundColor: '#d87f2a' }]}
          onPress={() => {
            setError(null);
            setOrderId(null);
            setLoading(false);
            cancelledRef.current = false;
            if (details) {
              setDetails({ ...details });
            }
          }}
        >
          <Text style={styles.proceedButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: 'white', marginTop: 15 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.centeredContainer}>
      <View style={styles.authContainer}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Image
            source={require('../../assets/images/razorpay-icon.svg')}
            style={{ width: 150, height: 150 }}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.authTitle}>Payment Authorization</Text>
        <Text style={styles.authLink}>Payment Authorize For</Text>
        <Text style={styles.productName}>{details?.name}</Text>
        <Text style={styles.productPrice}>₹{details?.totalBill}</Text>

        <TouchableOpacity
          style={styles.proceedButton}
          activeOpacity={0.8}
          onPress={handleProceedToPayment}
        >
          <Text style={styles.proceedButtonText}>PROCEED</Text>
        </TouchableOpacity>

        <Text style={styles.redirectText}>You will be redirected to payment</Text>

        <TouchableOpacity onPress={handleCancelPayment}>
          <Text style={styles.cancelPaymentText}>Cancel Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
