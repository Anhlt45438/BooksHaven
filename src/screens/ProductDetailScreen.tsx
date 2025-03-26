import React, {useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {getShopInfoById} from '../redux/shopSlice';
import {useSelector} from 'react-redux';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {styles} from './styles';

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
  ProductDetailScreen: {
    book: any;
  };
  book: Book;
  ShopHome: {id_shop: any};
};

const ProductDetailScreen: React.FC = () => {
  const route =
    useRoute<RouteProp<RootStackParamList, 'ProductDetailScreen'>>();
  const {book} = route.params;
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const shopState = useAppSelector(state => state.shop);
  const [quantity, setQuantity] = useState(1);
  const [averageRating, setAverageRating] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  const formatPrice = (price: number) => price.toLocaleString('vi-VN');

  const starFilled = require('../assets/icon_saovang.png');
  const starOutline = require('../assets/icon_saorong.png');
  const defaultAvatar = require('../assets/icons/user.png');
  const userr = useSelector((state: any) => state.user.user);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['40%'];

  React.useEffect(() => {
    if (book.id_shop) {
      dispatch(getShopInfoById(book.id_shop));
    }
  }, [dispatch, book.id_shop]);

  const fetchRatings = async (book: Book, page: number, limit: number) => {
    try {
      const url = `http://14.225.206.60:3000/api/ratings/book/${book.id_sach}?page=${page}&limit=${limit}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();

      const ratingsWithUserInfo = await Promise.all(
        data.data.map(async rating => {
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

  const handleSnapPress = useCallback(index => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);

  const addToCart = async () => {
    if (!userr?._id) {
      Alert.alert('Vui lòng đăng nhập trước khi thêm vào giỏ hàng!');
      return;
    }
    try {
      const response = await fetch('http://14.225.206.60:3000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userr?.accessToken}`,
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
      } else {
        Alert.alert(`Lỗi: ${data.message}`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Lỗi kết nối đến server!');
    }
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ScrollView style={styles.container}>
        <View style={styles.productImageContainer}>
          <Image source={{uri: book.anh}} style={styles.productImage} />
        </View>
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
            <TouchableOpacity style={styles.iconButton}>
              <Image
                source={require('../assets/icons/support.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Image
                source={require('../assets/icons/cart_user.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
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
          <View style={styles.shopInfoContainer}>
            {shopState.loading ? (
              <Text style={styles.loadingText}>Đang tải thông tin shop...</Text>
            ) : shopState.error ? (
              <Text style={styles.errorText}>{shopState.error}</Text>
            ) : shopState.shop ? (
              <TouchableOpacity
                style={styles.shopInfo}
                onPress={() =>
                  navigation.navigate('ShopHome', {id_shop: book.id_shop})
                }>
                <Image
                  source={{uri: shopState.shop.anh_shop}}
                  style={styles.shopImage}
                />
                <Text style={styles.shopName}>{shopState.shop.ten_shop}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.noShopText}>Không có thông tin shop</Text>
            )}
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={() => handleSnapPress(0)}>
              <Text style={styles.addToCartButtonText}>Thêm vào giỏ hàng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buyNowButton}>
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
              <Text style={styles.detailLabel}>Trạng thái:</Text>
              <Text style={styles.detailValue}>
                {book.trang_thai ? book.trang_thai : 'Không xác định'}
              </Text>
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
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                'ManDanhGia' as never,
                {
                  bookImage: book.anh,
                  bookName: book.ten_sach,
                  bookId: book.id_sach,
                } as never,
              )
            }>
            <Text style={styles.viewDetail}>Viết đánh giá</Text>
          </TouchableOpacity>
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
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}>
        <BottomSheetView style={styles.bottomSheetContainer}>
          <View style={styles.sheetContent1}>
            <Image source={{uri: book.anh}} style={styles.bookImage} />
            <View style={styles.textContainer}>
              <Text style={styles.bookTitle}>{book.ten_sach}</Text>
              <Text style={styles.price1}>{book.gia}</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton1}
              onPress={() => bottomSheetRef.current?.close()}>
              <Image
                source={require('../assets/image/close.png')}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Chọn số lượng</Text>
            {/* Sửa lại label cho đúng ý nghĩa */}
            <View style={styles.quantityControls}>
              <TouchableOpacity onPress={decreaseQuantity}>
                <Image
                  source={require('../assets/image/minus.png')}
                  style={styles.quantityButton}
                />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity onPress={increaseQuantity}>
                <Image
                  source={require('../assets/image/plus.png')}
                  style={styles.quantityButton}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.buyButton} onPress={addToCart}>
            <Text style={styles.buyButtonText}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default ProductDetailScreen;
