import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import CustomButton from "../components/CustomButtonProps.tsx";
import {StackNavigationProp} from "@react-navigation/stack";

type RootStackParamList = {
    Ratting: undefined;
};

type RatingScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Ratting'
>;

interface RattingScreenProps {
    navigation: RatingScreenNavigationProp;
}

const RatingScreen: React.FC<RattingScreenProps> = ({navigation}) => {
    const [rating, setRating] = useState(0);
    const stars = [1, 2, 3, 4, 5];
    const handleRating = (newRating: number) => {
        setRating(newRating);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đánh giá</Text>
            <Text style={styles.description}>
                Vui lòng chọn số sao bạn muốn đánh giá
            </Text>

            <View style={styles.starContainer}>
                {stars.map((item) => {
                    const isFilled = item <= rating;
                    return (
                        <TouchableOpacity
                            key={item}
                            onPress={() => handleRating(item)}
                            activeOpacity={0.8}
                        >
                            <Image
                                source={
                                    isFilled
                                        ? require('../assets/icons/staryellow.png')
                                        : require('../assets/icons/star.png')
                                }
                                style={styles.starImage}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>

            <Text style={styles.selectedRating}>
                Bạn đã đánh giá: <Text style={styles.highlight}>{rating} sao</Text>
            </Text>

            <CustomButton title={'Xác nhận'} onPress={()=> navigation.replace()}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 15,
        color: '#333',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: '#666',
    },
    starContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: 550,
    },
    starImage: {
        width: 40,
        height: 40,
        marginHorizontal: 5,
    },
    selectedRating: {
        textAlign: 'center',
        fontSize: 16,
        color: '#333',
        marginBottom: 30,
    },
    highlight: {
        color: '#ff9800',
        fontWeight: '700',
    },
    button: {
        backgroundColor: '#7f19b2',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 50,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default RatingScreen;
