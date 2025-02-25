import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export interface CustomGoogleUser {
    idToken: string;
    name?: string;
    email?: string;
    photo?: string;
}

interface CustomGoogleUserProps {
    user: CustomGoogleUser;
}

const CustomGoogleUserComponent: React.FC<CustomGoogleUserProps> = ({ user }) => {
    return (
        <View style={styles.container}>
            {user.photo ? (
                <Image source={{ uri: user.photo }} style={styles.avatar} />
            ) : (
                <View style={styles.placeholderAvatar} />
            )}
            <View style={styles.info}>
                <Text style={styles.name}>{user.name || 'Chưa có tên'}</Text>
                <Text style={styles.email}>{user.email || 'Chưa có email'}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    placeholderAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ccc',
    },
    info: {
        marginLeft: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
});

export default CustomGoogleUserComponent;
