import { StyleSheet } from 'react-native';

export const UPIPaymentStyles = StyleSheet.create({
    centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 17,
    color: '#6c757d',
    fontWeight: '500',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#006b8fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20, // Smoother rounded corners
    padding: 30, // Increased padding for more breathing room
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 }, // Deeper shadow for a floating effect
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  headerTitle: {
    fontSize: 28, // Larger and more prominent
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 8,
  },
  amountText: {
    fontSize: 20, 
    fontWeight: '700',
    color: '#555',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 14,
    marginVertical: 20,
    width: '100%',
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  payButton: {
    backgroundColor: '#E7613C',
    borderRadius: 12, // Smoother button corners
    padding: 18,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#E7613C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orText: {
    fontSize: 16,
    marginVertical: 30, // Increased vertical margin
    color: '#6c757d',
    fontWeight: '500',
  },
  upiAppsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
  },
  appButton: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  appIcon: {
    width: 60, // Slightly larger icons
    height: 60, // Slightly larger icons
    borderRadius: 15,
    marginBottom: 10,
  },
  appLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 17,
    color: '#6c757d',
    fontWeight: '500',
    textAlign: 'center',
  },
});