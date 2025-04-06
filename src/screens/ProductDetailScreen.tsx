import React, {useState, useCallback, useRef, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Modal,
} from 'react-native';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {getShopInfoById} from '../redux/shopSlice';
import {useSelector} from 'react-redux';
import BottomSheet from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {styles} from './styles';
import AddToCartBottomSheet from '../components/AddToCartBottomSheet.tsx';
import MenuOverlay from '../components/MenuOverlay.tsx';
import {fetchCart} from '../redux/cartSlice.tsx';
import {getAccessToken} from '../redux/storageHelper';

interface TheLoai {
  _id: string;
  id_the_loai: string;
  ten_the_loai: string;
}

interface Book {
  _id: string;
  id_sach: string;
  ten_sach: string;
  tac_gia: string;
  mo_ta: string;
  gia: number;
  so_luong: number;
  anh: string;
  trang_thai: string | null;
  so_trang: number;
  kich_thuoc: string;
  id_shop: string;
  the_loai: TheLoai[];
}

interface Rating {
  _id: string;
  id_danh_gia: string;
  id_user: string;
  id_sach: string;
  danh_gia: number;
  binh_luan: string;
  ngay_tao: string;
  user_name?: string;
  user_avatar?: string;
}

type RootStackParamList = {
  ProductDetailScreen: {book: any};
  book: Book;
  ShopHome: {id_shop: any};
  MessageDetail: {shop: any; id_conversation: any; hasShopRole: any};
  ManGioHang: undefined;
};

const ProductDetailScreen: React.FC = () => {
  const route =
    useRoute<RouteProp<RootStackParamList, 'ProductDetailScreen'>>();
  const {book} = route.params;
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const shopState = useAppSelector(state => state.shop);
  const userr = useSelector((state: any) => state.user.user);
  const cartItemCount = useAppSelector(state => state.cart.totalItems);
  const [quantity, setQuantity] = useState(1);
  const [averageRating, setAverageRating] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['40%', '70%', '100%'], []);
  const [isImageFullScreen, setIsImageFullScreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasShopRole, setHasShopRole] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchCart());
    }, [dispatch]),
  );

  const starFilled = require('../assets/icon_saovang.png');
  const starOutline = require('../assets/icon_saorong.png');
  const defaultAvatar = require('../assets/icons/user.png');

  const formatPrice = (price: any): string => {
    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) return 'Liên hệ';
    return numericPrice.toLocaleString('vi-VN');
  };

  const increaseQuantity = () => {
    if (quantity + 1 > book.so_luong) {
      Alert.alert('Số lượng sách không đủ để bán');
    } else {
      setQuantity(prev => prev + 1);
    }
  };
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const openBottomSheet = () => {
    setBottomSheetVisible(true);
    bottomSheetRef.current?.expand();
  };

  const closeBottomSheet = () => {
    setBottomSheetVisible(false);
    bottomSheetRef.current?.close();
  };

  const handleShare = async () => {
    const deepLink = `myapp://product/${book.id_sach}`;
    try {
      const result = await Share.share({
        message: `Xem sản phẩm này: ${deepLink}`,
      });
      if (result.action === Share.sharedAction) {
        console.log('Chia sẻ thành công');
      } else if (result.action === Share.dismissedAction) {
        console.log('Chia sẻ bị hủy');
      }
    } catch (error) {
      console.error('Lỗi khi chia sẻ:', error);
      Alert.alert('Lỗi', 'Không thể chia sẻ liên kết!');
    }
  };

  const handleReturnHome = () => {
    navigation.navigate('HomeTabBottom' as never);
    setMenuVisible(false);
  };

  const handleReport = () => {
    Alert.alert('Tố cáo', 'Chức năng tố cáo đang được phát triển!');
    setMenuVisible(false);
  };

  const handleHelp = () => {
    Alert.alert('Hỗ trợ', 'Chức năng hỗ trợ đang được phát triển!');
    setMenuVisible(false);
  };

  const fetchRatings = async (book: Book, page: number, limit: number) => {
    try {
      const url = `http://14.225.206.60:3000/api/ratings/book/${book.id_sach}?page=${page}&limit=${limit}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();

      const ratingsWithUserInfo = await Promise.all(
        data.data.map(async (rating: Rating) => {
          try {
            const userResponse = await fetch(
              `http://14.225.206.60:3000/api/users/user-info-account?user_id=${rating.id_user}`,
            );
            if (!userResponse.ok)
              throw new Error(`Failed to fetch user: ${userResponse.status}`);
            const userData = await userResponse.json();
            return {
              ...rating,
              user_name: userData.username || 'Anonymous',
              user_avatar: userData.avatar || null,
            };
          } catch (error) {
            console.error(`Error fetching user ${rating.id_user}:`, error);
            return {...rating, user_name: 'Anonymous', user_avatar: null};
          }
        }),
      );
      return {...data, data: ratingsWithUserInfo};
    } catch (error) {
      console.error('Error fetching ratings:', error);
      throw error;
    }
  };

  const addToCart = async () => {
    const accessToken = await getAccessToken();
    if (!userr?._id) {
      Alert.alert('Vui lòng đăng nhập trước khi thêm vào giỏ hàng!');
      return;
    }
    try {
      const response = await fetch('http://14.225.206.60:3000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          id_sach: book._id,
          id_user: userr._id,
          so_luong: quantity,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Thêm vào giỏ hàng thành công!');
        dispatch(fetchCart());
      } else {
        Alert.alert(`Lỗi: ${data.message}`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Lỗi kết nối đến server!');
    }
  };

  React.useEffect(() => {
    if (book.id_shop) {
      dispatch(getShopInfoById(book.id_shop));
    }
  }, [dispatch, book.id_shop]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setPage(1);
      setRatings([]);
      fetchRatings(book, 1, 10)
        .then(result => {
          setRatings(result.data);
          setAverageRating(result.average_rating || 0);
          setTotalPages(result.pagination.totalPages || 1);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error in useFocusEffect:', err);
          setLoading(false);
        });
    }, [book.id_sach]),
  );

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

      const foundConversation = data.data.find(
        (conv: any) => conv.id_user_2 === shopState.shop.id_user,
      );
      if (foundConversation) {
        navigation.navigate('MessageDetail', {
          shop: shopState.shop,
          id_conversation: foundConversation.id_hoi_thoai,
          hasShopRole,
        });
      } else {
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
        navigation.navigate('MessageDetail', {
          shop: shopState.shop,
          id_conversation: dataNew.data.id_hoi_thoai,
          hasShopRole,
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ScrollView style={styles.container}>
        <TouchableOpacity
          style={styles.productImageContainer}
          onPress={() => setIsImageFullScreen(true)}>
          <Image source={{uri: book.anh}} style={styles.productImage} />
        </TouchableOpacity>

        <View style={styles.iconOverlay}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}>
            <Image
              source={require('../assets/icons/back.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <View style={styles.rightIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={createConversation}>
              <Image
                source={require('../assets/icons/chat_user.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('ManGioHang')}>
              <Image
                source={require('../assets/image/shoppingcart.jpg')}
                style={styles.icon}
              />
              {cartItemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartItemCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setMenuVisible(true)}>
              <Image
                source={require('../assets/icons/menu-dots.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.bookTitle}>{book.ten_sach}</Text>
          <Text style={styles.author}>Tác giả: {book.tac_gia}</Text>
          <Text style={styles.price}>Giá: {formatPrice(book.gia)}đ</Text>

          <TouchableOpacity
            style={styles.shopInfoContainer}
            onPress={() =>
              navigation.navigate('ShopHome', {id_shop: book.id_shop})
            }>
            {shopState.loading ? (
              <Text style={styles.loadingText}>Đang tải thông tin shop...</Text>
            ) : shopState.error ? (
              <Text style={styles.errorText}>{shopState.error}</Text>
            ) : shopState.shop ? (
              <View style={styles.shopInfo}>
                <Image
                  source={{uri: shopState.shop.anh_shop}}
                  style={styles.shopImage}
                />
                <Text style={styles.shopName}>{shopState.shop.ten_shop}</Text>
              </View>
            ) : (
              <Text style={styles.noShopText}>Không có thông tin shop</Text>
            )}
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={() => {
                if (quantity > book.so_luong) {
                  Alert.alert('Số lượng sách không đủ để bán');
                } else {
                  openBottomSheet();
                }
              }}>
              <Text style={styles.addToCartButtonText}>Thêm vào giỏ hàng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buyNowButton}
              onPress={() => {
                if (book.so_luong == 0) {
                  Alert.alert('Sách đã bán hết, vui lòng chọn sách khác');
                } else {
                  navigation.navigate(
                    'ManThanhToan' as never,
                    {
                      book: book,
                      quantity: quantity,
                    } as never,
                  );
                }
              }}>
              <Text style={styles.buyNowButtonText}>Mua Ngay</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          <Text style={styles.description}>{book.mo_ta}</Text>

          <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>
          <View style={styles.detailContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Số trang:</Text>
              <Text style={styles.detailValue}>{book.so_trang}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Kích thước:</Text>
              <Text style={styles.detailValue}>{book.kich_thuoc}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Số lượng:</Text>
              <Text style={styles.detailValue}>{book.so_luong}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Thể loại:</Text>
              <Text style={styles.detailValue}>
                {book.the_loai.map(tl => tl.ten_the_loai).join(', ')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.ratingContainer}>
          <Text style={styles.sectionTitle}>Đánh giá sản phẩm</Text>
          <View style={styles.ratingSummary}>
            <Text style={styles.ratingValue}>{averageRating.toFixed(1)}</Text>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map(star => (
                <Image
                  key={star}
                  source={
                    star <= Math.floor(averageRating) ? starFilled : starOutline
                  }
                  style={styles.star}
                />
              ))}
            </View>
          </View>
          {ratings.length > 0 ? (
            ratings.map((rating, index) => (
              <View key={`${rating._id}-${index}`} style={styles.ratingItem}>
                <Image
                  source={
                    rating.user_avatar
                      ? {uri: rating.user_avatar}
                      : defaultAvatar
                  }
                  style={styles.userAvatar}
                />
                <View style={styles.ratingContent}>
                  <Text style={styles.userName}>
                    {rating.user_name || 'Anonymous'}
                  </Text>
                  <View style={styles.ratingStars}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Image
                        key={star}
                        source={
                          star <= rating.danh_gia ? starFilled : starOutline
                        }
                        style={styles.star}
                      />
                    ))}
                  </View>
                  <Text style={styles.comment}>{rating.binh_luan}</Text>
                  <Text style={styles.date}>
                    {new Date(rating.ngay_tao).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noRatingsText}>Chưa có đánh giá nào</Text>
          )}
          {page < totalPages && (
            <TouchableOpacity
              onPress={() => setPage(page + 1)}
              style={styles.loadMoreButton}>
              <Text style={styles.loadMoreText}>Xem thêm</Text>
            </TouchableOpacity>
          )}
          {loading && <Text style={styles.loadingText}>Đang tải...</Text>}
        </View>
      </ScrollView>

      {/* Modal hiển thị ảnh toàn màn hình */}
      <Modal
        visible={isImageFullScreen}
        transparent={false}
        animationType="fade">
        <View style={styles.fullScreenImageContainer}>
          <Image
            source={{uri: book.anh}}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.fullScreenBackButton}
            onPress={() => setIsImageFullScreen(false)}>
            <Image
              source={require('../assets/icons/back.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </Modal>

      {isBottomSheetVisible && (
        <AddToCartBottomSheet
          book={book}
          quantity={quantity}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
          addToCart={addToCart}
          closeBottomSheet={closeBottomSheet}
          snapPoints={snapPoints}
          bottomSheetRef={bottomSheetRef}
        />
      )}
      <MenuOverlay
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onShare={handleShare}
        onReturnHome={handleReturnHome}
        onReport={handleReport}
        onHelp={handleHelp}
      />
    </GestureHandlerRootView>
  );
};

export default ProductDetailScreen;
