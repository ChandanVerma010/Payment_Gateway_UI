import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../StylesSheet/PaymentDetails.styled.js';

interface Tag {
  label: string;
  color: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  discount: number;
  tags: Tag[];
}

interface CalculatedPlanDetails extends Plan {
  finalPrice: string;
  gstAmount: string;
  totalBill: string;
  discountAmount: string;
}

interface PricingDetailItem {
  id: string;
  label: string;
  value: string;
  isTotal?: boolean;
  color?: string;
}

const plansFallback: Plan[] = [
  { id: 'monthly', name: 'Monthly', price: 100, discount: 0, tags: [{ label: 'Basic', color: 'blue' }] },
  { id: 'quarterly', name: 'Quarterly', price: 2700, discount: 10, tags: [] },
  { id: 'halfyearly', name: 'Half-Yearly', price: 5000, discount: 15, tags: [] },
  { id: 'yearly', name: 'Yearly', price: 9500, discount: 20, tags: [{ label: 'Popular', color: '#FF7F50' }] },
];

const GST_RATE = 0.18;

// Utility function to simulate fetching data from a backend API
const fetchPlansFromApi = (): Promise<Plan[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(plansFallback);
    }, 1500); 
  });
};

const calculatePlanDetails = (plan: Plan): CalculatedPlanDetails => {
  const discountAmount = plan.price * (plan.discount / 100);
  const finalPrice = plan.price - discountAmount;
  const gstAmount = finalPrice * GST_RATE;
  const totalBill = finalPrice + gstAmount;

  const dynamicTags = [...plan.tags];
  if (plan.discount > 0) {
    dynamicTags.push({ label: `Disc -${plan.discount}%`, color: '#4CAF50' });
  }

  return {
    ...plan,
    finalPrice: finalPrice.toFixed(2),
    gstAmount: gstAmount.toFixed(2),
    totalBill: totalBill.toFixed(2),
    discountAmount: discountAmount.toFixed(2),
    tags: dynamicTags,
  };
};

// --- Reusable Components ---

const PlanCard: React.FC<{ plan: Plan; isSelected: boolean; onPress: (plan: Plan) => void }> = ({ plan, isSelected, onPress }) => (
  <TouchableOpacity
    style={[
      styles.planCard,
      isSelected && styles.selectedCard,
      plan.tags.some(tag => tag.label === 'Popular') && styles.popularCard,
    ]}
    onPress={() => onPress(plan)}
    activeOpacity={0.8}
  >
    {plan.tags.map((tag) => (
      <View key={tag.label} style={[styles.tagContainer, { backgroundColor: tag.color }]}>
        <Text style={styles.tagText}>{tag.label}</Text>
      </View>
    ))}
    <Text style={styles.planName}>{plan.name}</Text>
    {plan.discount > 0 ? (
      <>
        <Text style={styles.originalPrice}>₹{plan.price}</Text>
        <Text style={styles.finalPrice}>₹{calculatePlanDetails(plan).finalPrice}</Text>
      </>
    ) : (
      <Text style={styles.finalPrice}>₹{plan.price}</Text>
    )}
  </TouchableOpacity>
);

const PricingDetails: React.FC<{ details: CalculatedPlanDetails | null }> = ({ details }) => {
  if (!details) return null;

  const data: PricingDetailItem[] = [
    { id: 'chosenPlan', label: 'Chosen Plan', value: details.name },
    { id: 'basePrice', label: 'Base Price', value: `₹${details.price}` },
  ];

  if (details.discount > 0) {
    data.push({
      id: 'discount',
      label: `Discount (${details.discount}%)`,
      value: `-₹${details.discountAmount}`,
      color: 'red',
    });
  }


  data.push(
    { id: 'gst', label: 'GST (18%)', value: `₹${details.gstAmount}` },
    { id: 'total', label: 'Total Amount', value: `₹${details.totalBill}`, isTotal: true }
  );

  return (
    <View style={styles.pricingContainer}>
      <Text style={styles.pricingTitle}>Pricing Details</Text>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.pricingRow, item.isTotal ? styles.totalRow : null]}>
            <Text style={styles.pricingLabel}>{item.label}</Text>
            <Text style={[styles.pricingValue, item.color ? { color: item.color } : null]}>
              {item.value}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const PaymentDetails: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const fetchedPlans = await fetchPlansFromApi();
        setAvailablePlans(fetchedPlans);
        if (fetchedPlans.length > 0) {
          setSelectedPlan(fetchedPlans[0]);
        }
      } catch (e) {
        setError('Failed to fetch plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#FF7F50" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (availablePlans.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>No plans available.</Text>
      </View>
    );
  }

  const details = selectedPlan ? calculatePlanDetails(selectedPlan) : null;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Pricing Summary</Text>
        <View style={styles.planList}>
          {availablePlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan?.id === plan.id}
              onPress={setSelectedPlan}
            />
          ))}
        </View>
        {details && <PricingDetails details={details} />}
        <TouchableOpacity
          style={styles.continueButton}
          activeOpacity={0.8}
          onPress={() => {
            router.push({ pathname: '/(stack)/AuthRazorpay', params: { selectedPlanDetails: JSON.stringify(details) } });
          }}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default PaymentDetails;
