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
import {fetchUserData} from '../redux/userSlice';
import {getAccessToken} from '../redux/storageHelper';

type RootStackParamList = {
  ShopHome: {id_shop: any};
  ProductDetailScreen: {book: any};
  MessageDetail: {shop: any; id_conversation: any};
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const user = useAppSelector(state => state.user.user);

  React.useEffect(() => {
    if (id_shop) {
      dispatch(getShopInfoById(id_shop));
    }
  }, [dispatch, id_shop]);
  const [filteredProducts, setFilteredProducts] = useState<Book[]>([]);
  useEffect(() => {
    setFilteredProducts(products); // Khi lấy dữ liệu mới, hiển thị toàn bộ sách
  }, [products]);

  const handleSearch = text => {
    setSearch(text);
    if (text.trim().length === 0) {
      setFilteredProducts([]);
    } else {
      const filtered = products.filter(book =>
        book.ten_sach.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredProducts(filtered);
    }
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('vi-VN');
  };
  useEffect(() => {
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
        console.log(data.data);
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

  const createConversation = async () => {
    const accessToken = await getAccessToken();

    try {
      setLoading(true);
      // Lấy danh sách các cuộc hội thoại hiện có
      const response = await fetch(
        'http://14.225.206.60:3000/api/conversations?page=1&limit=20',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Lỗi khi tải tin nhắn');
      }

      const data = await response.json();

      // Kiểm tra xem có cuộc hội thoại nào với id_user_2 === shopState.shop.id_user không
      const foundConversation = data.data.find(
        (conv: any) => conv.id_user_2 === shopState.shop.id_user,
      );

      if (foundConversation) {
        // Nếu đã có thì chuyển sang MessageDetail với cuộc hội thoại hiện có
        navigation.navigate('MessageDetail', {
          shop: shopState.shop,
          id_conversation: foundConversation.id_hoi_thoai, // hoặc: foundConversation.id_conversation nếu cần truyền id cụ thể
        });
      } else {
        // Nếu chưa có, tạo cuộc hội thoại mới
        const newConversation = {
          id_user_2: shopState.shop.id_user,
        };

        const responseNew = await fetch(
          'http://14.225.206.60:3000/api/conversations',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(newConversation),
          },
        );

        if (!responseNew.ok) {
          throw new Error('Lỗi khi tạo cuộc trò chuyện');
        }

        const dataNew = await responseNew.json();
        console.log('datanew: ', dataNew);

        navigation.navigate('MessageDetail', {
          shop: shopState.shop,
          id_conversation: dataNew.data.id_hoi_thoai,
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Tìm kiếm sản phẩm"
                value={search}
                onChangeText={handleSearch}
                style={styles.textInput}
              />
              {search.length > 0 && (
                <FlatList
                  data={filteredProducts}
                  keyExtractor={item => item._id}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => {
                        setSearch(item.ten_sach);
                        navigation.navigate('ProductDetailScreen', {
                          book: item,
                        });
                      }}>
                      <Image
                        source={{uri: item.anh}}
                        style={styles.productImage1}
                      />
                      <View
                        style={{
                          flex: 1,
                          paddingStart: 20,
                          alignItems: 'flex-start',
                        }}>
                        <Text style={styles.bookTitle} numberOfLines={1}>
                          {item.ten_sach}
                        </Text>
                        <Text style={styles.price}>{item.gia}đ</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  style={styles.suggestionsList}
                />
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.goBackButton}>
            <Image
              style={[styles.icon, {height: 24, width: 24, marginLeft: 'auto'}]}
              source={require('../assets/icons/dots.png')}
            />
          </TouchableOpacity>
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

          <TouchableOpacity
            style={styles.viewShopButton}
            onPress={createConversation}>
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
  productImage1: {
    width: 50,
    height: 50,
    borderRadius: 8,
    resizeMode: 'contain',
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
  inputWrapper: {
    flex: 1,
    position: 'relative',
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
  suggestionsList: {
    position: 'absolute',
    top: 40, // Đặt ngay dưới TextInput
    left: -10, // Căn chỉnh với padding của searchContainer
    right: -10,
    backgroundColor: 'white',
    borderRadius: 5,
    maxHeight: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    zIndex: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
  },
  suggestionText: {
    fontSize: 16,
  },
});
