import React, { useRef } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import ActionSheet from 'react-native-actionsheet';

const MenuDots = () => {
    const actionSheetRef = useRef<ActionSheet>(null);
    const options = ['Chia sẻ', 'Quay lại Trang chủ', 'Tố cáo người dùng này', 'Bạn cần giúp đỡ?', 'Hủy'];

    return (
        <View>
            <TouchableOpacity onPress={() => actionSheetRef.current?.show()}>
                <Image source={require('../assets/icons/dots.png')} style={{ width: 30, height: 30 }} />
            </TouchableOpacity>

            <ActionSheet
                ref={actionSheetRef}
                options={options}
                cancelButtonIndex={4}
                onPress={(index) => {
                    if (index === 1) {
                        // Quay lại trang chủ
                    } else if (index === 2) {
                        // Tố cáo người dùng
                    } else if (index === 3) {
                        // Hỗ trợ
                    }
                }}
            />
        </View>
    );
};

export default MenuDots;
