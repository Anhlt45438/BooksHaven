import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useAppSelector, useAppDispatch} from '../redux/hooks';
import {getShopInfoById} from '../redux/shopSlice';

type RootStackParamList = {
  ShopHome: {id_shop: any};
  ProductDetailScreen: {book: any};
};

type ShopHomeNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ShopHome'
>;
type ShopHomeRouteProp = RouteProp<RootStackParamList, 'ShopHome'>;

interface ShopHomeProps {
  navigation: ShopHomeNavigationProp;
  route: ShopHomeRouteProp;
}
interface Book {
  _id: string;
  ten_sach: string;
  gia: number;
  anh: string;
}

const ShopHome: React.FC<ShopHomeProps> = ({route, navigation}) => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Book[]>([]);
  const {id_shop} = route.params;
  const dispatch = useAppDispatch();
  const shopState = useAppSelector(state => state.shop);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  React.useEffect(() => {
    if (id_shop) {
      dispatch(getShopInfoById(id_shop));
    }
  }, [dispatch, id_shop]);

  const formatPrice = (price: number): string => {
    return price.toLocaleString('vi-VN');
  };
  useEffect(() => {
    // Gọi API khi component mount
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://14.225.206.60:3000/api/shops/products/id-shop/${id_shop}`,
        );
        if (!response.ok) {
          throw new Error('Lỗi khi tải sản phẩm');
        }
        const data = await response.json();
        setProducts(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id_shop]);

  if (loading) {
    return <Text>Đang tải...</Text>;
  }

  if (error) {
    return <Text>Lỗi: {error}</Text>;
  }

  const renderBookItem = ({item}: {item: Book}) => {
    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() =>
          navigation.navigate('ProductDetailScreen', {
            book: item,
          })
        }>
        <Image source={{uri: item.anh}} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.bookTitle} numberOfLines={1}>
            {item.ten_sach}
          </Text>
          <Text style={styles.price}>{formatPrice(item.gia)}đ</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <ImageBackground
        source={require('../assets/images/image.png')}
        style={styles.background}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.goBackButton}
            onPress={() => navigation.goBack()}>
            <Image
              style={styles.icon}
              source={require('../assets/icons/aaa.png')}
            />
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <Image
              source={require('../assets/icons/search.png')}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Tìm kiếm sản phẩm trong shop"
              value={search}
              onChangeText={setSearch}
              style={styles.textInput}
              placeholderTextColor="#AAA4B1"
            />
          </View>
        </View>

        <View style={styles.userInfo}>
          <Image
            style={styles.shopImage}
            source={
              shopState.shop.anh_shop &&
              (shopState.shop.anh_shop.startsWith('http') ||
                shopState.shop.anh_shop.startsWith('data:image/'))
                ? {uri: shopState.shop.anh_shop}
                : require('../assets/image/avatar.png')
            }
          />
          <View style={styles.shopDetails}>
            <Text style={styles.userName} numberOfLines={1}>
              {shopState.shop.ten_shop}
            </Text>
          </View>

          <TouchableOpacity style={styles.viewShopButton}>
            <Image
              source={require('../assets/icons/mess.png')}
              style={styles.searchIcon}
            />
            <Text style={styles.viewShopText}>Chat</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mota}>
          <Text style={styles.motatxt}>{shopState.shop.mo_ta}</Text>
        </View>
      </ImageBackground>

      <FlatList
        data={products && Array.isArray(products) ? products : []}
        keyExtractor={(item: Book) => item._id}
        numColumns={2}
        renderItem={renderBookItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
      />
    </View>
  );
};

export default ShopHome;

const styles = StyleSheet.create({
  background: {
    flexDirection: 'column',
    resizeMode: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    width: '100%',
    paddingHorizontal: 15,
  },
  goBackButton: {
    width: '10%',
  },
  icon: {
    tintColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 8, 8, 0.22)',
    borderRadius: 15,
    width: '80%',
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#fff',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 5,
    color: '#fff',
  },
  userInfo: {
    flexDirection: 'row',
    marginVertical: 15,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  shopImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  shopDetails: {
    marginLeft: 10,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  viewShopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    borderWidth: 1,
    borderColor: '#fff',
    padding: 8,
    borderRadius: 10,
  },
  viewShopText: {
    fontSize: 16,
    color: '#fff',
  },
  mota: {
    width: '100%',
    backgroundColor: 'rgba(217, 211, 211, 0.45)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
  },
  motatxt: {
    fontSize: 16,
    color: '#333',
    marginHorizontal: 10,
  },
  booksList: {
    paddingHorizontal: 10,
  },
  productCard: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: '45%',
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  productInfo: {
    marginTop: 10,
    alignItems: 'center',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    color: '#d32f2f',
    textAlign: 'center',
  },
});
