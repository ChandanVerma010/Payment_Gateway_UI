import { useRouter, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { paymentSuccessStyles as styles } from '../StylesSheet/PaymentSuccess.styles.js';
import { AntDesign } from '@expo/vector-icons';

interface PaymentDetails {
  planName: string;
  subscriptionPeriod: string;
  amountPaid: string;
  receiptEmail: string;
}

export default function PaymentSuccessfulPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Assuming data is passed from the successful Razorpay transaction callback
  const paymentDetails: PaymentDetails = {
    planName: params.planName as string || "Plan Name",
    subscriptionPeriod: params.subscriptionPeriod as string || "Monthly",
    amountPaid: params.amountPaid as string || "₹4716/-",
    receiptEmail: params.receiptEmail as string || "abc@gmail.com",
  };

  const handleContinue = () => {
    // Navigate back to the home screen or user dashboard
    router.replace('/'); 
  };

  const handleDownloadInvoice = () => {
    alert('Simulating invoice download.');
    // In a real app, you would initiate a download from your backend
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalCard}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.replace('/')}>
          <AntDesign name="closecircleo" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.successTitle}>Payment Successful</Text>
        <Text style={styles.successSubtitle}>Thank you for subscribing to our service</Text>

        <View style={styles.successCheckContainer}>
          <AntDesign name="checkcircleo" size={48} color="#4CAF50" />
        </View>

        <View style={styles.receiptNote}>
          <Text style={styles.noteText}>
            Note: The payment receipt has been sent to an email "{paymentDetails.receiptEmail}".
          </Text>
        </View>

        <Text style={styles.subscriptionTitle}>Subscription Details</Text>
        <View style={styles.subscriptionRow}>
          <Text style={styles.subscriptionLabel}>Subscription Plan:</Text>
          <Text style={styles.subscriptionValue}>{paymentDetails.planName}</Text>
        </View>
        <View style={styles.subscriptionRow}>
          <Text style={styles.subscriptionLabel}>Subscription Period:</Text>
          <Text style={styles.subscriptionValue}>{paymentDetails.subscriptionPeriod}</Text>
        </View>
        <View style={styles.subscriptionRow}>
          <Text style={styles.subscriptionLabel}>Amount Paid:</Text>
          <Text style={styles.subscriptionValue}>{paymentDetails.amountPaid}</Text>
        </View>

        <View style={styles.modalButtons}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadInvoice}>
            <Text style={styles.buttonText}>Download Invoice</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}