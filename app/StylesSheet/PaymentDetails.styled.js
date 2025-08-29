import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#006b8fff', 
  },
  container: {
    backgroundColor: '#fff',
    padding: 24, // Increased padding
    borderRadius: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: '#d9534f', // A more professional red
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: 24, // Larger title
    fontWeight: '800', // Bolder font weight
    color: '#2c3e50', // Darker, more professional text color
    textAlign: 'center',
    marginBottom: 30,
  },
  planList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  planCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#EFEFEF', // Lighter border color
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    minHeight: 120,
  },
  selectedCard: {
    borderColor: '#26A69A',
    backgroundColor: '#E0F2F1',
    shadowOpacity: 0.2, // More pronounced shadow when selected
  },
  popularCard: {
    borderColor: '#FF7F50',
  },
  tagContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#3498db', // A nice blue for tags
  },
  tagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  planName: {
    fontSize: 18, // Larger font size
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  originalPrice: {
    fontSize: 14,
    color: '#95a5a6', // Softer gray
    textDecorationLine: 'line-through',
  },
  finalPrice: {
    fontSize: 20, // Larger final price
    fontWeight: 'bold',
    color: '#26A69A', // A vibrant green
  },
  pricingContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  pricingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    marginTop: 10,
    paddingTop: 10,
  },
  pricingLabel: {
    fontSize: 16,
    color: '#555',
  },
  pricingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  continueButton: {
    backgroundColor: '#FF7F50',
    borderRadius: 12,
    paddingVertical: 18, // More padding for a bolder button
    alignItems: 'center',
    marginTop: 40, // More spacing
    shadowColor: '#FF7F50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;