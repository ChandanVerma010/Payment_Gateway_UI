import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#006b8fff',
        padding: 24,
    },
    authContainer: {
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#fff',
        borderRadius: 20, 
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 }, 
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    razorpayLogo: {
        fontSize: 36, 
        fontWeight: '900',
        color: '#007BFF',
        marginBottom: 30, 
    },
    authTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    authLink: {
        color: '#007BFF',
        textDecorationLine: 'underline',
        marginBottom: 20,
        fontSize: 14,
    },
    productName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#1A1A1A',
    },
    productPrice: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#E7613C', // Highlighted price color
    },
    proceedButton: {
        backgroundColor: '#E7613C',
        borderRadius: 14,
        padding: 18,
        alignItems: 'center',
        width: '100%',
        shadowColor: '#E7613C',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8,
    },
    proceedButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    redirectText: {
        marginTop: 24,
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
        lineHeight: 20,
    },
    cancelPaymentText: {
        marginTop: 16,
        color: '#007BFF',
        textDecorationLine: 'underline',
        fontSize: 14,
    },
});

export default styles;