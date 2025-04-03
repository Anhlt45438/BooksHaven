import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    productImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    productImage: {
        width: '80%',
        height: 350,
        resizeMode: 'cover',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginTop: 10,
    },
    iconOverlay: {
        position: 'absolute',
        top: 20,
        left: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: 5,
        borderRadius: 30,
        marginHorizontal: 5,
    },
    icon: {
        width: 24,
        height: 24,
        tintColor: '#fff',
    },
    rightIcons: {
        flexDirection: 'row',
    },
    infoContainer: {
        padding: 20,
        backgroundColor: '#fff',
        marginTop: -20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    bookTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    author: {
        fontSize: 18,
        color: '#777',
        marginBottom: 10,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#d32f2f',
        marginBottom: 20,
    },
    shopInfoContainer: {
        marginVertical: 20,
    },
    shopInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 10,
    },
    shopImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    shopName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    loadingText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        marginBottom: 20,
    },
    noShopText: {
        fontSize: 16,
        color: '#777',
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 20,
        width: '100%',
        justifyContent: 'center',
    },
    buyNowButton: {
        backgroundColor: '#d32f2f',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginLeft: 10,
        width: '48%',
    },
    buyNowButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    addToCartButton: {
        backgroundColor: '#fff',
        borderColor: '#d32f2f',
        borderWidth: 1,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '48%',
        marginRight: 10,
    },
    addToCartButtonText: {
        color: '#d32f2f',
        fontSize: 15,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
    },
    detailContainer: {
        backgroundColor: '#fafafa',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 16,
        color: '#777',
        flex: 1,
    },
    detailValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        flex: 2,
        textAlign: 'right',
    },
    ratingContainer: {
        marginVertical: 20,
        padding: 10,
        backgroundColor: '#fafafa',
        borderRadius: 10,
    },
    ratingSummary: {
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 20,
    },
    ratingValue: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#000000',
        marginRight: 30,
    },
    ratingStars: {
        flexDirection: 'row',
        marginVertical: 5,
    },
    star: {
        width: 20,
        height: 20,
        marginHorizontal: 2,
    },
    viewDetail: {
        marginTop: 30,
        fontSize: 16,
        color: '#5908B0',
        textDecorationLine: 'underline',
        textAlign: 'center',
    },
    ratingItem: {
        flexDirection: 'row',
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    ratingContent: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    comment: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
    },
    date: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
    },
    loadMoreButton: {
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#5908B0',
        borderRadius: 5,
        marginTop: 10,
    },
    loadMoreText: {
        color: '#fff',
        fontSize: 16,
    },
    noRatingsText: {
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
        marginTop: 10,
    },
    badge: {
        position: "absolute",
        top: -5,
        right: -5,
        backgroundColor: '#ff4242',
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: "center",
        alignItems: "center",
    },
    badgeText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    fullScreenImageContainer: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenImage: {
        width: '100%',
        height: '100%',
    },
    fullScreenBackButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 10,
    },
});