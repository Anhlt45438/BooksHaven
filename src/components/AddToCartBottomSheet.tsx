import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import BottomSheet, {BottomSheetBackdrop, BottomSheetView} from '@gorhom/bottom-sheet';

interface AddToCartBottomSheetProps {
    book: any; // Bạn có thể giữ interface Book trong file gốc
    quantity: number;
    increaseQuantity: () => void;
    decreaseQuantity: () => void;
    addToCart: () => void;
    closeBottomSheet: () => void;
    snapPoints: string[];
    bottomSheetRef: React.RefObject<BottomSheet>;
}

const AddToCartBottomSheet: React.FC<AddToCartBottomSheetProps> = ({
                                                                       book,
                                                                       quantity,
                                                                       increaseQuantity,
                                                                       decreaseQuantity,
                                                                       addToCart,
                                                                       closeBottomSheet,
                                                                       snapPoints,
                                                                       bottomSheetRef,
                                                                   }) => {
    return (
        <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            onClose={closeBottomSheet}
            backdropComponent={(props) => <BottomSheetBackdrop animatedIndex={1} animatedPosition={-1} {...props} />}
            handleIndicatorStyle={{backgroundColor: 'black'}}
            backgroundStyle={{backgroundColor: '#efefef'}}
        >
            <BottomSheetView style={styles.bottomSheetContainer}>
                <View style={styles.sheetContent1}>
                    <Image source={{uri: book.anh}} style={styles.bookImage}/>
                    <View style={styles.textContainer}>
                        <Text style={[styles.bookTitle, {fontSize: 24}]}>{book.ten_sach}</Text>
                        <Text style={styles.price1}>{book.trang_thai ? book.trang_thai : 'Không xác định'}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.closeButton1} onPress={closeBottomSheet}>
                    <Image source={require('../assets/image/close.png')} style={styles.closeIcon}/>
                </TouchableOpacity>
                <View style={styles.quantityContainer}>
                    <Text style={styles.quantityLabel}>Chọn số lượng</Text>
                    <View style={styles.quantityControls}>
                        <TouchableOpacity onPress={decreaseQuantity}>
                            <Image source={require('../assets/image/minus.png')} style={styles.quantityButton}/>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity onPress={increaseQuantity}>
                            <Image source={require('../assets/image/plus.png')} style={styles.quantityButton}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.buyButton} onPress={addToCart}>
                    <Text style={styles.buyButtonText}>Thêm vào giỏ hàng</Text>
                </TouchableOpacity>
            </BottomSheetView>
        </BottomSheet>
    );
};

export default AddToCartBottomSheet;
const styles = StyleSheet.create({
    bookTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    textContainer: {
        flex: 1,
        marginLeft: 15,
    },
    bottomSheetContainer: {
        padding: 20,
        backgroundColor: '#efefef',
        borderRadius: 15,
        height: '150%',
    },
    sheetContent1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    closeButton1: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
    },
    quantityButton: {
        width: 13,
        height: 13,
        marginHorizontal: 10,
    },
    quantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 0,
        paddingHorizontal: 10,
    },
    price1: {
        fontSize: 16,
        color: 'purple',
        marginTop: 5,
    },
    quantityLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    closeIcon: {
        width: 18,
        height: 18,
    },
    quantityText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    buyButton: {
        marginTop: 30,
        backgroundColor: '#08B05C',
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    buyButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    bookImage: {
        width: 80,
        height: 120,
        borderRadius: 10,
    },
})