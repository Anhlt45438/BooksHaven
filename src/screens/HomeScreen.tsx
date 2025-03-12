import React from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    FlatList,
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
];

const products = [
    {id: '1', image: require('../assets/image/image.png'), price: '16.800đ', label: 'Flash Sale'},
    {id: '2', image: require('../assets/image/image.png'), price: '252.000đ'},
    {id: '3', image: require('../assets/image/image.png'), price: '191.000đ'},
    {id: '4', image: require('../assets/image/image.png'), price: '161.000đ'},
];

const product1 = [
    {id: '1', image: require('../assets/image/image.png'), price: '16.800đ'},
    {id: '2', image: require('../assets/image/image.png'), price: '16.800đ'},
    {id: '3', image: require('../assets/image/image.png'), price: '16.800đ'},
    {id: '4', image: require('../assets/image/image.png'), price: '16.800đ'},
]

const {height} = Dimensions.get('window');
const HomeScreen = () => {
    return (
        <FlatList
            ListHeaderComponent={
                <>
                    <View style={styles.header}>
                        <TextInput style={styles.searchBar} placeholder="Tìm kiếm trên Shopee"/>
                        <TouchableOpacity>
                            <Image source={require('../assets/image/shoppingcart.jpg')} style={styles.icon}/>
                            <View style={styles.badge}><Text style={styles.badgeText}>16</Text></View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={require('../assets/image/conversation.png')} style={styles.icon}/>
                            <View style={styles.badge}><Text style={styles.badgeText}>9</Text></View>
                        </TouchableOpacity>
                    </View>

                    {/* Banner */}
                    <Image source={require('../assets/image/image.png')} style={styles.bannerImage}
                           resizeMode='stretch'/>

                    {/* Categories */}
                    <View style={styles.categoryContainer}>
                        {categories.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.categoryItem}>
                                <Image source={{uri: item.image}} style={styles.categoryImage}/>
                                <Text style={styles.categoryText}>{item.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Flash Sale */}
                    <Text style={styles.sectionTitle}>🔥 Siêu Giao Dịch</Text>
                    <FlatList
                        horizontal
                        data={products}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => (
                            <View style={styles.productCard}>
                                <Image source={item.image} style={styles.productImage}/>
                                {item.label && <Text style={styles.flashSale}>{item.label}</Text>}
                                <Text style={styles.price}>{item.price}</Text>
                            </View>
                        )}
                        showsHorizontalScrollIndicator={false}
                    />

                    <Text style={styles.sectionTitle}>🔥 Sách gì chưa người đẹp</Text>
                </>
            }
            data={product1}
            keyExtractor={item => item.id}
            numColumns={2}
            renderItem={({item}) => (
                <View style={styles.productCard1}>
                    <Image source={item.image} style={styles.productImage}/>
                    <Text style={styles.price}>{item.price}</Text>
                </View>
            )}
            contentContainerStyle={styles.productList}
        />
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#f5f5f5'},
    header: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff'},
    searchBar: {flex: 1, backgroundColor: '#eee', padding: 8, borderRadius: 20},
    icon: {width: 24, height: 24, marginLeft: 10},
    bannerImage: {width: '100%', height: height * 0.35},
    categoryContainer: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', padding: 10},
    categoryItem: {alignItems: 'center', width: '25%', padding: 5},
    categoryImage: {width: 60, height: 60, borderRadius: 30},
    categoryText: {fontSize: 12, marginTop: 5, textAlign: 'center'},
    sectionTitle: {fontSize: 18, fontWeight: 'bold', marginVertical: 10, color: '#ff5722', paddingLeft: 10},
    productCard: {backgroundColor: 'white', marginRight: 10, padding: 10, borderRadius: 8, alignItems: 'center'},
    productImage: {width: 120, height: 120, borderRadius: 8},
    flashSale: {
        backgroundColor: 'yellow',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
        padding: 3,
        borderRadius: 5,
        marginVertical: 5
    },
    price: {fontSize: 16, fontWeight: 'bold', color: '#d32f2f'},
    badge: {position: 'absolute', top: -5, right: -5, backgroundColor: 'red', borderRadius: 10, paddingHorizontal: 6},
    badgeText: {color: '#fff', fontSize: 12, fontWeight: 'bold'},
    productList: {
        paddingHorizontal: 10,
        justifyContent: 'space-between'
    },
    productCard1: {
        flex: 1,
        backgroundColor: 'white',
        margin: 5,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center'
    },

});

export default HomeScreen;  