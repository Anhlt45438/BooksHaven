import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageSourcePropType } from 'react-native';

interface CustomAppBarProps {
    title: string;
    onBackPress?: () => void;
    rightIcon?: ImageSourcePropType;  // Nếu có icon bên phải, truyền vào đây
    onRightPress?: () => void;         // Callback khi nhấn vào icon bên phải
}

const CustomAppBar: React.FC<CustomAppBarProps> = ({ title, onBackPress, rightIcon, onRightPress }) => {
    return (
        <View style={styles.appBar}>
            {onBackPress ? (
                <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
                    <Image source={require('../assets/icons/back.png')} />
                </TouchableOpacity>
            ) : (
                <View style={styles.backPlaceholder} />
            )}
            <Text style={styles.title}>{title}</Text>
            {rightIcon ? (
                <TouchableOpacity onPress={onRightPress} style={styles.rightButton}>
                    <Image source={rightIcon} style={styles.rightIcon} />
                </TouchableOpacity>
            ) : (
                <View style={styles.rightPlaceholder} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    appBar: {
        height: 56,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    backButton: {
        padding: 10,
    },
    backPlaceholder: {
        width: 44,
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        color: '#000',
        fontWeight: '600',
    },
    rightButton: {
        padding: 10,
    },
    rightPlaceholder: {
        width: 44,
    },
    rightIcon: {
        width: 24,
        height: 24,
    },
});

export default CustomAppBar;
