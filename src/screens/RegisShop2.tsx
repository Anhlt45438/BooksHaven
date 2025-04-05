import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {useAppSelector, useAppDispatch} from '../redux/hooks';
import {StackNavigationProp} from '@react-navigation/stack';
import {registerShop} from '../redux/shopSlice';
import PushNotification from 'react-native-push-notification';
import {getAccessToken} from '../redux/storageHelper';

type RootStackParamList = {
  RegisShop2: {user: any};
  MyShop: {shopData: any; user: any};
  UpdateDiaChiScreen: {field: any; currentValue: any};
  UpdateAccountScreen: {field: any; currentValue: any};
};

type RegisShop2NavigationProp = StackNavigationProp<
  RootStackParamList,
  'RegisShop2'
>;
type RegisShop2RouteProp = RouteProp<RootStackParamList, 'RegisShop2'>;

interface RegisShop2Props {
  route: RegisShop2RouteProp;
  navigation: RegisShop2NavigationProp;
}

const RegisShop2: React.FC<RegisShop2Props> = ({navigation, route}) => {
  const user = useAppSelector(state => state.user.user);
  const dispatch = useAppDispatch();
  const [shopName, setShopName] = useState('');

  const sendRegistrationNotification = () => {
    const logoPath = require('../assets/icons/logo.png');
    PushNotification.localNotification({
      channelId: 'shop-registration-channel',
      title: 'Đăng ký shop thành công!',
      message: `Chúc mừng ${shopName} đã đăng ký shop thành công.`,
      bigText:
        "Chúc mừng bạn đã gia nhập cộng đồng Book's Haven. Hãy đăng bán những quyển sách hay và bán thật đắt hàng nhé!",
      largeIcon: logoPath, // Thêm ảnh lớn (logo app)
      priority: 'high', // Mức độ ưu tiên cao
    });
  };
  const handleRegisterShop = async () => {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      Alert.alert(
        'Lỗi',
        'Không có mã thông báo truy cập. Vui lòng đăng nhập lại.',
      );
      return;
    }

    if (!shopName || !user.dia_chi) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }
    const shopData = {
      ten_shop: shopName,
      mo_ta: 'Mô tả shop ở đây',
    };

    // Dispatch action registerShop, truyền cả shopData và accessToken
    dispatch(registerShop({shopData, accessToken: accessToken})).then(
      (result: any) => {
        if (result.type === registerShop.fulfilled.type) {
          Alert.alert('Thông báo', 'Đăng ký shop thành công!');
          navigation.navigate('MyShop', {shopData: result.payload, user});
        } else {
          Alert.alert('Lỗi', 'Có lỗi xảy ra. Vui lòng thử lại.');
        }
      },
    );
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <Text style={styles.headertext}>Thông tin shop</Text>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.box1}>
          <View style={styles.introTextContainer}>
            <Text style={styles.introText}>
              Vui lòng cung cấp thông tin để lập tài khoản
            </Text>
            <Text style={styles.introText}>người bán trên Book's Haven</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Tên shop"
            value={shopName}
            onChangeText={setShopName}
          />
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() =>
              navigation.navigate('UpdateDiaChiScreen', {
                field: 'dia_chi',
                currentValue: user?.dia_chi || '', // Sử dụng optional chaining để kiểm tra null/undefined
              })
            }>
            <Text style={styles.infoLabel}>Địa chỉ</Text>
            <View style={styles.infoRight}>
              <Text style={[styles.infoText, !user?.dia_chi && {color: 'red'}]}>
                {user?.dia_chi
                  ? user.dia_chi.length > 20
                    ? user.dia_chi.substring(0, 25) + '...'
                    : user.dia_chi
                  : 'Chưa thiết lập'}
              </Text>
              <Image
                source={require('../assets/icons/next.png')}
                style={styles.nextIcon}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoRow}
            onPress={() =>
              Alert.alert('Thông báo', 'Bạn không thể thay đổi địa chỉ email')
            }>
            <Text style={styles.infoLabel}>Email</Text>
            <View style={styles.infoRight}>
              <Text style={[styles.infoText, !user?.email && {color: 'red'}]}>
                {user?.email || 'Chưa thiết lập'}
              </Text>
              <Image
                source={require('../assets/icons/next.png')}
                style={styles.nextIcon}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() =>
              navigation.navigate('UpdateAccountScreen', {
                field: 'sdt',
                currentValue: user.sdt || '',
              })
            }>
            <Text style={styles.infoLabel}>Số điện thoại</Text>
            <View style={styles.infoRight}>
              <Text style={[styles.infoText, !user?.sdt && {color: 'red'}]}>
                {user?.sdt || 'Chưa thiết lập'}
              </Text>
              <Image
                source={require('../assets/icons/next.png')}
                style={styles.nextIcon}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.box2}>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: '#D9D9D9'}]}
            onPress={() => navigation.goBack()}>
            <Text style={[styles.buttontext, {color: 'black'}]}>Quay lại</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleRegisterShop}>
            <Text style={styles.buttontext}>Tiếp theo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  headertext: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F1EFF1',
    justifyContent: 'space-between',
  },
  box1: {
    width: '90%',
    height: 550,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'flex-start',
    margin: 15,
  },
  introTextContainer: {
    alignItems: 'center',
    padding: 20,
  },
  introText: {
    marginBottom: 15,
  },
  imageRow: {
    flexDirection: 'row',
  },
  divider: {
    height: 0.3,
    width: 150,
    backgroundColor: 'gray',
    marginTop: 10,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  subHeaderText: {
    color: 'red',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.1,
    marginBottom: 10,
    width: '80%',
    paddingLeft: 10,
  },
  button1: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: '95%',
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  content: {marginHorizontal: '10%'},
  inputGroup: {
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginTop: 10,
  },
  box2: {
    width: '100%',
    height: 170,
    backgroundColor: 'white',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  button: {
    width: 180,
    height: 40,
    backgroundColor: '#00B822',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttontext: {
    fontSize: 20,
    color: 'white',
  },
  infoRow: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
    paddingVertical: 15,
    marginHorizontal: 10,
  },
  infoLabel: {fontWeight: 'bold', fontSize: 15},
  infoRight: {flexDirection: 'row', alignItems: 'center'},
  infoText: {fontSize: 15, color: '#555', marginRight: 10},
  nextIcon: {width: 20, height: 20},
});

export default RegisShop2;
