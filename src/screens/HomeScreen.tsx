import React from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';

const {width} = Dimensions.get('window');

const banners = [
    {id: '1', image: 'https://via.placeholder.com/350x150'},
    {id: '2', image: 'https://via.placeholder.com/350x150'},
    {id: '3', image: 'https://via.placeholder.com/350x150'},
];

const categories = [
    {
        id: '1',
        title: 'Kiếm hiệp',
        image: 'https://th.bing.com/th/id/OIP.kkVHlDRW3gsM6rxGDElncwHaD3?rs=1&pid=ImgDetMain'
    },
    {
        id: '2',
        title: 'truyện tranh',
        image: 'https://nhatrangbooks.com/wp-content/uploads/2019/10/img958.u2487.d20160907.t132040.973911-2.jpg'
    },
    {id: '3', title: 'Alime', image: 'https://th.bing.com/th/id/OIP.EC6crylNIyxOsTekRmkEkAHaKk?rs=1&pid=ImgDetMain'},
    {id: '4', title: 'Khoa học', image: 'https://th.bing.com/th/id/OIP.30eDIDWVeRQbDzfM3_mKIAHaEK?rs=1&pid=ImgDetMain'},
    {id: '5', title: 'Nấu ăn', image: 'https://th.bing.com/th/id/OIP.ehhwqDC2O9ZWTXV1HKymgQAAAA?rs=1&pid=ImgDetMain'},
    {
        id: '6',
        title: 'Chính trị',
        image: 'https://th.bing.com/th/id/OIP.sdHDvDmTOCPAurPwk-Cz9wHaFP?rs=1&pid=ImgDetMain'
    },
    {id: '7', title: 'Lịch sử', image: 'https://th.bing.com/th/id/OIP.MTyqyphqre94b_LSEAvyaQHaD4?rs=1&pid=ImgDetMain'},
    {id: '8', title: 'Văn học', image: 'https://th.bing.com/th/id/OIP.di77cQrhy3uBt8Yin98PewHaFj?rs=1&pid=ImgDetMain'},
];


const HomeScreen = () => {
    return (
        <View style={styles.container}>
            {/* Header Search Bar */}
            <View style={styles.header}>
                <TextInput style={styles.searchBar} placeholder="Tìm kiếm trên Shopee"/>
                <Image source={{uri: 'https://via.placeholder.com/24'}} style={styles.icon}/>
                <Image source={{uri: 'https://via.placeholder.com/24'}} style={styles.icon}/>
            </View>

            <ScrollView>
                {/* Static Image Display */}
                <Image source={require('../assets/image/image.jpg')} style={{width: '100%', height: '65%'}}
                       resizeMode='stretch'/>

                {/* Categories */}
                <View style={styles.categoryContainer}>
                    {categories.map((item) => (
                        <View key={item.id} style={styles.categoryItem}>
                            <TouchableOpacity>
                                <Image source={{uri: item.image}} style={styles.categoryImage}/>
                                <Text style={styles.categoryText}>{item.title}</Text>
                            </TouchableOpacity>

                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#f5f5f5'},
    header: {flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#fff'},
    searchBar: {flex: 1, backgroundColor: '#eee', padding: 8, borderRadius: 20},
    icon: {width: 24, height: 24, marginLeft: 10},
    banner: {width: '100%', height: 150, resizeMode: 'cover', marginBottom: 10},
    categoryContainer: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', padding: 10},
    categoryItem: {alignItems: 'center', width: '25%', padding: 5},
    categoryImage: {width: 60, height: 60, borderRadius: 30},
    categoryText: {fontSize: 12, marginTop: 5, textAlign: 'center'},
});

export default HomeScreen;