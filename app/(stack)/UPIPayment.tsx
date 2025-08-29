import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { UPIPaymentStyles as styles } from '../StylesSheet/UPIPayment.styles';
import { createRazorpayOrder as mockCreateRazorpayOrder } from '../api.js';

interface UpiApp {
  key: string;
  label: string;
  icon: any;
  package?: string;
}

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


const upiLogoTop = require('../../assets/images/upi.png');
const phonepeIcon = require('../../assets/images/phonepe.png');
const paytmIcon = require('../../assets/images/paytm.png');
const gpayIcon = require('../../assets/images/Gpay.png');

const upiApps: UpiApp[] = [
  { key: 'phonepe', label: 'PhonePe', icon: phonepeIcon, package: 'com.phonepe.app' },
  { key: 'paytm', label: 'Paytm', icon: paytmIcon, package: 'net.one97.paytm' },
  { key: 'googlepay', label: 'Google Pay', icon: gpayIcon, package: 'com.google.android.apps.nbu.paisa.user' },
];

const MOCK_PLAN_DETAILS: PlanDetails = {
  totalBill: 1716.0,
  name: 'Java Subscription',
};

const isValidUpi = (upi: string): boolean => {
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z0-9.\-_]{2,64}$/;
  return upiRegex.test(upi.trim());
};

const createRealRazorpayOrder = async (planDetails: PlanDetails): Promise<RazorpayOrderResponse> => {
    // This is a placeholder for actual backend API call
    console.log('Using real API call...');
    // Replace with real fetch call to your server
    // return { success: true, orderId: data.order_id };
    return { success: false, error: 'Real API not implemented yet.' };
};

export default function UPIPayment() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [upiId, setUpiId] = useState('');
    const [loading, setLoading] = useState(false);
    const [processingApp, setProcessingApp] = useState<string | null>(null);
    const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);
    const isProduction = false; // Set to true for production
    const razorpayKey = 'rzp_test_RApkmIn54r2hQ7'; 

    useEffect(() => {
      const raw = params?.selectedPlanDetails;
      if (typeof raw === 'string') {
        try {
          const parsedDetails = JSON.parse(raw);
          setPlanDetails(parsedDetails);
        } catch (e) {
          console.error('Failed to parse selectedPlanDetails:', e);
          Alert.alert('Error', 'Invalid payment details received.');
        }
      } else {
        setPlanDetails(MOCK_PLAN_DETAILS);
      }
    }, [params.selectedPlanDetails]);

    const amountInPaise = useMemo(() => {
      if (!planDetails || typeof planDetails.totalBill !== 'number') {
        return 0;
      }
      return Math.round(planDetails.totalBill * 100);
    }, [planDetails]);

    const createOrder = useCallback(async (): Promise<RazorpayOrderResponse> => {
        setLoading(true);
        try {
            const resp = isProduction
                ? await createRealRazorpayOrder(planDetails as PlanDetails)
                : await mockCreateRazorpayOrder(planDetails as PlanDetails);
            
            if (resp?.success && resp.orderId) {
                return { success: true, orderId: resp.orderId };
            }
            return { success: false, error: resp?.error || 'Failed to create order on server' };
        } catch (err) {
            console.error('createOrder error', err);
            return { success: false, error: 'Network or server error when creating order' };
        } finally {
            setLoading(false);
        }
    }, [planDetails, isProduction]);

    const openRazorpayCheckout = useCallback(
        (orderId: string, vpa?: string, packageName?: string) => {
            if (!razorpayKey) {
                Alert.alert("Error", "Razorpay key is not configured.");
                return;
            }

            const options = {
                description: 'UPI Payment',
                image: 'https://yourdomain.com/your_logo.png',
                currency: 'INR',
                key: razorpayKey,
                amount: amountInPaise,
                name: 'Your Company Name',
                order_id: orderId,
                method: 'upi',
                prefill: {
                    vpa: vpa || undefined,
                },
                upi_app_package_name: packageName,
            };

            RazorpayCheckout.open(options)
                .then((data: any) => {
                    Alert.alert('Payment Success', `Payment ID: ${data.razorpay_payment_id}`);
                })
                .catch((error: any) => {
                    Alert.alert('Payment Failed', `Error: ${error?.code ?? ''} ${error?.description ?? ''}`);
                });
        },
        [amountInPaise, razorpayKey]
    );

    const handlePayWithUpiId = useCallback(async () => {
        if (!isValidUpi(upiId)) {
            Alert.alert('Invalid UPI ID', 'Please enter a valid UPI ID in the format example@bank');
            return;
        }
        
        let orderId = planDetails?.orderId;
        if (!orderId) {
            const res = await createOrder();
            if (!res.success) {
                Alert.alert('Order creation failed', res.error ?? 'Unable to create order.');
                return;
            }
            orderId = res.orderId!;
        }
        
        await openRazorpayCheckout(orderId, upiId.trim());
    }, [upiId, createOrder, openRazorpayCheckout, planDetails]);

    const handleAppRedirect = useCallback(
        async (app: UpiApp) => {
            setProcessingApp(app.key);
            try {
                let orderId = planDetails?.orderId;
                if (!orderId) {
                    const res = await createOrder();
                    if (!res.success) {
                        Alert.alert('Order creation failed', res.error ?? 'Unable to create order.');
                        return;
                    }
                    orderId = res.orderId!;
                }
                
                await openRazorpayCheckout(orderId, undefined, app.package);

            } catch (err) {
                console.error('handleAppRedirect error', err);
                Alert.alert('Payment Error', 'Failed to initiate UPI app redirect.');
            } finally {
                setProcessingApp(null);
            }
        },
        [planDetails, createOrder, openRazorpayCheckout]
    );

    if (loading || !planDetails) {
        return (
            <View style={styles.centeredContainer}>
                <ActivityIndicator size="large" color="#E7613C" />
                <Text style={styles.loadingText}>Creating order...</Text>
            </View>
        );
    }

    if (processingApp) {
        return (
            <View style={styles.centeredContainer}>
                <ActivityIndicator size="large" color="#E7613C" />
                <Text style={styles.loadingText}>Redirecting to {processingApp}...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Image source={upiLogoTop} style={{ width: 120, height: 60, alignSelf: 'center', marginBottom: 18, resizeMode: 'contain' }} />
                <Text style={styles.headerTitle}>Pay via UPI</Text>
                <Text style={styles.amountText}>
                    Total: ₹{typeof planDetails.totalBill === 'number' && !isNaN(planDetails.totalBill) ? planDetails.totalBill.toFixed(2) : '0.00'}
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your UPI ID (e.g., example@bank)"
                    placeholderTextColor="#999"
                    value={upiId}
                    onChangeText={text => setUpiId(text)}
                />
                <TouchableOpacity style={styles.payButton} onPress={handlePayWithUpiId}>
                    <Text style={styles.payButtonText}>Pay with UPI ID</Text>
                </TouchableOpacity>
                <Text style={styles.orText}>Or pay using your UPI app:</Text>
                <View style={styles.upiAppsContainer}>
                    {upiApps.map(app => (
                        <TouchableOpacity
                            key={app.key}
                            style={styles.appButton}
                            onPress={() => handleAppRedirect(app)}
                        >
                            <Image source={app.icon} style={styles.appIcon} />
                            <Text style={styles.appLabel}>{app.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
}