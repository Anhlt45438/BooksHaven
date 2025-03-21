import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import HorizontalLine from '../components/HorizontalLine';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useAppSelector, useAppDispatch} from '../redux/hooks';
import {fetchUserData} from '../redux/userSlice';


type RootStackParamList = {
  User: undefined;
  MyShop: {user: any};
  RegisShop: {user: any};
  SettingAccount: undefined;
  Message: undefined;
  ManSuaHoSo: undefined;
};

type UserScreenNavigationProp = StackNavigationProp<RootStackParamList, 'User'>;
type UserScreenRouteProp = RouteProp<RootStackParamList, 'User'>;

interface UserScreenProps {
  navigation: UserScreenNavigationProp;
  route: UserScreenRouteProp;
}

const UserScreen: React.FC<UserScreenProps> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.user) || {
    _id: '',
    username: 'Người dùng',
    avatar: null,
    accessToken: '',
  };
  const [hasShopRole, setHasShopRole] = React.useState(false);

  useEffect(() => {
    if (user._id && user.accessToken) {
      const userId =
        typeof user._id === 'object' && user._id.$oid
          ? user._id.$oid
          : user._id;
      dispatch(fetchUserData(userId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (user._id) {
      const fetchUserRole = async () => {
        try {
          const response = await fetch(
            `http://14.225.206.60:3000/api/users/user-info-account?user_id=${user._id}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${user.accessToken}`,
              },
            },
          );

          if (!response.ok) {
            throw new Error('Server error');
          }

          const result = await response.json();
          let isShop = false;
          for (const item of result.vai_tro) {
            if (item.ten_role === 'shop') {
              isShop = true;
              break;
            }
          }
          setHasShopRole(isShop);
        } catch (error: unknown) {
          if (error instanceof Error) {
            Alert.alert(
              'Lỗi',
              error.message || 'Không thể lấy dữ liệu vai trò.',
            );
          } else {
            Alert.alert('Lỗi', 'Đã xảy ra lỗi không xác định.');
          }
        }
      };
      fetchUserRole();
    }
  }, []);

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        {/* Bên trái header: Nút "Bắt đầu bán" + Avatar + Tên */}
        <View style={styles.headerLeftContainer}>
          <View style={styles.shopButtonWrapper}>
            <TouchableOpacity
              style={styles.shopButtonRow}
              onPress={() => {
                if (hasShopRole) {
                  navigation.navigate('MyShop', {user});
                } else {
                  navigation.navigate('RegisShop', {user});
                }
              }}>
              <Image
                style={styles.iconSmallBlack}
                source={require('../assets/icons/shop_user.png')}
              />
              <Text style={styles.shopButtonText}>Bắt đầu bán</Text>
              <Image
                style={styles.iconSmallBlack}
                source={require('../assets/icons/next_user.png')}
              />
            </TouchableOpacity>
          </View>

          {/* Avatar + Tên + Thống kê */}
          <View style={styles.userInfoRow}>
            <Image
              source={
                user.avatar
                  ? {uri: user.avatar}
                  : require('../assets/icons/user.png')
              }
              style={styles.iconProfileLarge}
            />
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('ManSuaHoSo')}>
              <Image
                source={require('../assets/icons/edit.png')} // Đường dẫn đến ảnh edit.png
                style={styles.editIcon}
              />
            </TouchableOpacity>
            <View style={styles.column}>
              <Text style={styles.userName}>{user.username}</Text>
              <View style={styles.userStats}>
                <View style={styles.dot} />
                <Text style={styles.statText}>0 Người theo dõi</Text>
                <View style={styles.dot} />
                <Text style={styles.statText}>2 Đang theo dõi</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bên phải header: Icon cài đặt, giỏ hàng, chat */}
        <View style={styles.headerRightContainer}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => navigation.navigate('UserSetting')}>
            <Image
              source={require('../assets/icons/setting_user.png')}
              style={styles.iconWhite}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Image
              source={require('../assets/icons/cart_user.png')}
              style={styles.iconWhite}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => navigation.navigate('Message')}>
            <Image
              source={require('../assets/icons/chat_user.png')}
              style={styles.iconWhite}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* Nội dung cuộn */}
      <ScrollView style={styles.scrollContainer}>
        <HorizontalLine thickness={10} marginVertical={0} />

        {/* Đơn mua */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Đơn mua</Text>
            <TouchableOpacity
              onPress={() => console.log('Xem lịch sử mua hàng')}>
              <Text style={styles.sectionLink}>Xem lịch sử mua hàng</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rowIcons}>
            <TouchableOpacity style={styles.iconBox}>
              <Image
                source={require('../assets/icons/wallet_user.png')}
                style={styles.iconImageLarge}
              />
              <Text style={styles.iconBoxText}>Chờ xác nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBox}>
              <Image
                source={require('../assets/icons/box_user.png')}
                style={styles.iconImageLarge}
              />
              <Text style={styles.iconBoxText}>Chờ xác nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBox}>
              <Image
                source={require('../assets/icons/truck_user.png')}
                style={styles.iconImageLarge}
              />
              <Text style={styles.iconBoxText}>Đang giao</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBox}>
              <Image
                source={require('../assets/icons/review_user.png')}
                style={styles.iconImageLarge}
              />
              <Text style={styles.iconBoxText}>Chờ đánh giá</Text>
            </TouchableOpacity>
          </View>
        </View>

        <HorizontalLine thickness={10} marginVertical={0} />

        {/* Quan tâm */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quan tâm</Text>
          </View>
          <View style={[styles.row, styles.rowIcons]}>
            <TouchableOpacity style={styles.iconBox}>
              <Image
                source={require('../assets/icons/visibility.png')}
                style={styles.iconImageLarge}
              />
              <Text style={styles.iconBoxText}>Đã xem</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBox}>
              <Image
                source={require('../assets/icons/favorite_user.png')}
                style={styles.iconImageLarge}
              />
              <Text style={styles.iconBoxText}>Yêu thích</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBox}>
              <Image
                source={require('../assets/icons/cart_user.png')}
                style={styles.iconImageLarge}
              />
              <Text style={styles.iconBoxText}>Mua lại</Text>
            </TouchableOpacity>
          </View>
        </View>

        <HorizontalLine thickness={10} marginVertical={0} />

        {/* Hỗ trợ */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, styles.row]}>
            <Text style={styles.sectionTitle}>Hỗ trợ</Text>
          </View>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listItemText}>Trung tâm trợ giúp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listItemText}>Gửi tin nhắn cho chúng tôi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listItem}>
            <Text style={styles.listItemText}>Shopee Blog</Text>
          </TouchableOpacity>
        </View>

        <View style={{height: 50}} />
      </ScrollView>
    </View>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fdfdfd',
  },
  header: {
    height: 140,
    backgroundColor: '#ff5722',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  headerLeftContainer: {
    flexDirection: 'column',
    paddingVertical: 25,
  },
  shopButtonWrapper: {
    marginTop: -20,
    backgroundColor: '#fff',
    borderRadius: 30,
    marginLeft: -100,
    width: 210,
    height: 28,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  shopButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 30,
  },
  iconSmallBlack: {
    width: 15,
    height: 15,
    tintColor: '#000',
  },
  shopButtonText: {
    fontSize: 12,
    color: '#000',
    marginHorizontal: 5,
  },
  userInfoRow: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatarButton: {
    marginLeft: 15,
  },
  iconProfileLarge: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 5,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666',
    marginHorizontal: 6,
  },
  statText: {
    fontSize: 12,
    color: '#fff',
  },
  headerRightContainer: {
    flexDirection: 'row',
    marginBottom: 'auto',
  },
  headerIcon: {
    marginLeft: 15,
  },
  iconWhite: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fdfdfd',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionLink: {
    color: '#ff5722',
    fontSize: 14,
  },
  rowIcons: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-around',
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: '#f5f6ff',
    padding: 10,
    borderRadius: 20,
  },
  iconImageLarge: {
    width: 40,
    height: 40,
  },
  iconBoxText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginTop: 5,
  },
  listItem: {
    paddingVertical: 10,
  },
  listItemText: {
    fontSize: 14,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  iconRow: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-around',
  },
  iconLarge: {
    width: 40,
    height: 40,
  },
  editButton: {
    position: 'absolute',
    bottom: -5,
    right: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Màu trắng trong suốt
    borderRadius: 15,
    padding: 5,
    elevation: 5, // Hiệu ứng bóng
  },
  editIcon: {
    width: 20,
    height: 20,
    opacity: 0.8, // Làm mờ icon nếu cần
  },
});
