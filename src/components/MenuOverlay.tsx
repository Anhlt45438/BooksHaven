import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';

interface MenuOverlayProps {
    visible: boolean;
    onClose: () => void;
    onShare: () => void;
    onReturnHome: () => void;
    onReport: () => void;
    onHelp: () => void;
}

const MenuOverlay: React.FC<MenuOverlayProps> = ({
                                                     visible,
                                                     onClose,
                                                     onShare,
                                                     onReturnHome,
                                                     onReport,
                                                     onHelp,
                                                 }) => {
    if (!visible) return null;

    return (
        <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuItem} onPress={onShare}>
                    <Image source={require('../assets/icons/icons8-share-24.png')} style={styles.icon}/>
                    <Text style={styles.menuText}>Chia sẻ</Text>
                </TouchableOpacity>
                <View style={styles.ke}></View>
                <TouchableOpacity style={styles.menuItem} onPress={onReturnHome}>
                    <Image source={require('../assets/icons/icons8-home-24.png')} style={styles.icon}/>
                    <Text style={styles.menuText}>Quay lại Trang chủ</Text>
                </TouchableOpacity>
                <View style={styles.ke}></View>
                <TouchableOpacity style={styles.menuItem} onPress={onReport}>
                    <Image source={require('../assets/icons/icons8-warning-30.png')} style={styles.icon}/>
                    <Text style={styles.menuText}>Tố cáo sản phẩm này</Text>
                </TouchableOpacity>
                <View style={styles.ke}></View>
                <TouchableOpacity style={styles.menuItem} onPress={onHelp}>
                    <Image source={require('../assets/icons/icons8-help-50.png')} style={styles.icon}/>
                    <Text style={styles.menuText}>Bạn cần giúp đỡ?</Text>
                </TouchableOpacity>
            </View>

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        marginBottom: 'auto',
        alignItems: 'flex-end',
        padding: 30
    },
    menuContainer: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        width: 210,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    icon: {
        width: 23,
        height: 23,
        marginRight: 12,
        tintColor: 'gray',
    },
    menuText: {
        fontSize: 16,
        color: 'black',
    },
    ke:{
        height: 0.5,
        backgroundColor: '#e3e3e3',
        width: 150,
        marginLeft: 'auto'
    }
});

export default MenuOverlay;