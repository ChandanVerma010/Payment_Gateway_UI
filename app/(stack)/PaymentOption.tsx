import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { paymentOptionStyles as styles } from '../StylesSheet/PaymentOption.styles';

interface PaymentOptionItem {
  key: string;
  label: string;
  icon: number;
}

interface PlanDetails {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  name?: string;
  totalBill?: number;
  orderId?: string;
}

const upiIcon = require('../../assets/images/upi.png');
const cardIcon = require('../../assets/images/card.png');
const netbankingIcon = require('../../assets/images/netbanking.png');
const razorpayLogo = require('../../assets/images/razorpay-icon.svg');
const arrowIcon = require('../../assets/images/arrow.png');

const paymentOptions: PaymentOptionItem[] = [
  { key: 'upi', label: 'UPI', icon: upiIcon },
  { key: 'card', label: 'CARD', icon: cardIcon },
  { key: 'netbanking', label: 'NET BANKING', icon: netbankingIcon },
];

export default function PaymentOption() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const { orderId, planDetails } = useMemo(() => {
    let extractedOrderId = typeof params.orderId === 'string' ? params.orderId : '';
    let extractedPlanDetails: PlanDetails | null = null;
    
    if (typeof params.selectedPlanDetails === 'string') {
      try {
        extractedPlanDetails = JSON.parse(params.selectedPlanDetails);
      } catch (e) {
        console.error("Failed to parse selectedPlanDetails:", e);
        extractedPlanDetails = null;
      }
    }
    return {
      orderId: extractedOrderId,
      planDetails: extractedPlanDetails,
    };
  }, [params]);


  const customerName = planDetails?.customerName || "Mr Steven";
  const customerEmail = planDetails?.customerEmail || "steven@yahoo.com";
  const customerPhone = planDetails?.customerPhone || "+919791989492";
  const productName = planDetails?.name || "Java";
  const productPrice = planDetails?.totalBill ? Number(planDetails.totalBill) : 1716;

  const handleSelectPaymentMethod = (optionKey: string) => {
    let route = '';
    if (optionKey === 'upi') route = '/(stack)/UPIPayment';
    else if (optionKey === 'card') route = '/(stack)/CardPayment';
    else if (optionKey === 'netbanking') route = '/(stack)/NetbankingPayment';
    
    if (route) {
      router.push({
        pathname: route,
        params: {
          orderId,
          selectedPlanDetails: JSON.stringify({
            name: productName,
            totalBill: productPrice,
            orderId,
          })
        }
      });
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={razorpayLogo}
          style={styles.razorpayLogo}
          resizeMode="contain"
        />

        <Text style={styles.orderLabel}>Order 1:</Text>
        <Text style={styles.orderIdText}>Order ID: {orderId}</Text>
        <Text style={styles.customerName}>{customerName}</Text>
        <Text style={styles.customerContact}>{customerEmail}</Text>
        <Text style={styles.customerContact}>{customerPhone}</Text>

        <View style={styles.divider} />

        <View style={styles.productRow}>
          <Text style={styles.productName}>{productName}</Text>
          <Text style={styles.productPrice}>₹{productPrice.toFixed(2)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.paymentOptionsContainer}>
          {paymentOptions.map(option => (
            <TouchableOpacity
              key={option.key}
              style={styles.paymentOptionItem}
              onPress={() => handleSelectPaymentMethod(option.key)}
              activeOpacity={0.7}
            >
              <View style={styles.paymentOptionLeft}>
                <Image
                  source={option.icon}
                  style={[styles.paymentOptionIcon, { width: 48, height: 48, borderRadius: 12 }]}
                  resizeMode="contain"
                />
                <Text style={styles.paymentOptionLabel}>{option.label}</Text>
              </View>
              <Image source={arrowIcon} style={styles.arrowIcon} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.payButton} activeOpacity={0.8} onPress={() => handleSelectPaymentMethod('upi')}>
          <Text style={styles.payButtonText}>PAY</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}