import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Keyboard,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {
  launchCamera,
  launchImageLibrary,
  MediaType,
  CameraOptions,
  PhotoQuality,
} from 'react-native-image-picker';
import {useAppSelector, useAppDispatch} from '../redux/hooks';
import {updateShopInfo} from '../redux/shopSlice';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

type RootStackParamList = {
  EditShop: {shop: any; user: any};
};
type EditShopNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EditShop'
>;

type EditShopRouteProp = RouteProp<RootStackParamList, 'EditShop'>;

interface EditShopProps {
  route: EditShopRouteProp;
  navigation: EditShopNavigationProp;
}

const EditShop: React.FC<EditShopProps> = ({route, navigation}) => {
  const user = useAppSelector(state => state.user.user) || {
    _id: '',
    username: '',
    sdt: '',
    email: '',
    avatar: null,
    accessToken: '',
  };
  const shop = useAppSelector(state => state.shop.shop) || {
    _id: '',
    ten_shop: '',
    anh_shop: null,
    mo_ta: '',
  };
  const dispatch = useAppDispatch();
  const [shopName, setShopName] = useState(shop.ten_shop);
  const [description, setDescription] = useState(shop.mo_ta);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.sdt);
  const [loading, setLoading] = useState(false); // Add loading state

  // Quản lý trạng thái hiển thị Modal
  const [showLogoModal, setShowLogoModal] = useState(false);
  // Quản lý ảnh/logo đã chọn (nếu có)
  const [selectedMedia, setSelectedMedia] = useState(
    shop.anh_shop &&
      (shop.anh_shop.startsWith('http') ||
        shop.anh_shop.startsWith('data:image/'))
      ? {uri: shop.anh_shop}
      : require('../assets/image/avatar.png'),
  );

  // Mở Modal
  const openLogoModal = () => {
    Keyboard.dismiss(); // ẩn bàn phím nếu đang mở
    setShowLogoModal(true);
  };

  // Đóng Modal
  const closeLogoModal = () => {
    setShowLogoModal(false);
  };

  // Hàm chuyển đổi ảnh sang base64
  // Hàm chuyển đổi ảnh sang base64 và thêm chuỗi định dạng
  const convertToBase64 = (uri: string) => {
    return new Promise<string>((resolve, reject) => {
      if (Platform.OS === 'ios') {
        // Chuyển ảnh từ thư viện hoặc camera thành base64 cho iOS
        const fetchImage = fetch(uri);
        fetchImage
          .then(res => res.blob())
          .then(blob => {
            const reader = new FileReader();
            reader.onloadend = () => {
              // Thêm chuỗi data:image/jpeg;base64, vào trước base64
              const base64Data = `data:image/jpeg;base64,${reader.result}`;
              resolve(base64Data);
            };
            reader.onerror = error => reject(error);
            reader.readAsDataURL(blob);
          })
          .catch(reject);
      } else {
        // Android sử dụng react-native-fs để đọc ảnh và chuyển thành base64
        const RNFS = require('react-native-fs');
        RNFS.readFile(uri, 'base64')
          .then((base64Data: string) => {
            // Thêm chuỗi data:image/jpeg;base64, vào trước base64
            resolve(`data:image/jpeg;base64,${base64Data}`);
          })
          .catch(reject);
      }
    });
  };
  // Chọn ảnh từ Camera
  const openCamera = () => {
    const options: CameraOptions = {
      mediaType: 'photo' as MediaType, // ép kiểu mediaType thành MediaType
      quality: 1, // Ép kiểu quality thành một trong các giá trị hợp lệ của PhotoQuality
    };
    launchCamera(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera error: ', response.errorMessage);
        Alert.alert('Camera error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const media = response.assets[0];
        // Kiểm tra nếu media.uri không phải là undefined
        if (media.uri) {
          try {
            const base64Image = await convertToBase64(media.uri); // Chuyển ảnh sang base64
            setSelectedMedia({uri: base64Image});
          } catch (error) {
            console.error('Error converting to base64: ', error);
            Alert.alert(
              'Error converting image to base64',
              'Please try again.',
            );
          }
        } else {
          console.error('No URI found for the image');
        }
      }
      closeLogoModal();
    });
  };
  // Chọn ảnh từ thư viện
  const openLibrary = () => {
    const options: CameraOptions = {
      mediaType: 'photo' as MediaType,
      quality: 1,
    };
    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker error: ', response.errorMessage);
        Alert.alert('ImagePicker error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const media = response.assets[0];
        if (media.uri) {
          try {
            const base64Image = await convertToBase64(media.uri); // Chuyển ảnh sang base64
            setSelectedMedia({uri: base64Image});
          } catch (error) {
            console.error('Error converting to base64: ', error);
            Alert.alert(
              'Error converting image to base64',
              'Please try again.',
            );
          }
        } else {
          console.error('No URI found for the image');
        }
      }
      closeLogoModal();
    });
  };

  // Lưu thông tin cửa hàng
  const handleSave = async () => {
    setLoading(true); // Set loading to true when saving starts
    const updatedShopData = {
      ten_shop: shopName,
      mo_ta: description,
      email: email,
      sdt: phoneNumber,
      anh_shop: selectedMedia?.uri || shop.anh_shop,
    };

    try {
      await dispatch(
        updateShopInfo({
          shopData: updatedShopData,
          shopId: shop._id,
          accessToken: user.accessToken,
        }),
      );
      navigation.goBack();
    } catch (error) {
      console.error('Error updating shop:', error);
      Alert.alert('Error', 'Failed to update shop. Please try again.');
    } finally {
      setLoading(false); // Set loading to false when saving finishes
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/icons/Vector.png')}
            style={{width: 20, height: 20}}
          />
        </TouchableOpacity>
        <Text style={styles.headertext}>Sửa hồ sơ shop</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text style={{color: 'red', fontSize: 20, marginTop: 5}}>
            {loading ? 'Đang lưu...' : 'Lưu'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{alignItems: 'center'}}>
        <View style={styles.box}>
          {/* Hiển thị ảnh đã chọn nếu có, nếu chưa thì hiển thị icon user.png */}
          <TouchableOpacity onPress={openLogoModal}>
            <Image
              source={{uri: selectedMedia?.uri}} // Hiển thị ảnh từ base64
              style={{
                width: 60,
                height: 60,
                marginLeft: 10,
                borderRadius: 30,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={openLogoModal}>
            <Text style={{color: '#8D8D8D', fontSize: 17, marginLeft: 10}}>
              Logo shop
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.box}>
          <Text style={{fontSize: 20, color: '#8D8D8D', width: '30%'}}>
            Tên Shop
          </Text>
          <TextInput
            placeholder="Nhập vào văn bản"
            value={shopName}
            onChangeText={setShopName}
            style={{width: '70%', textAlign: 'right', fontSize: 20}}
          />
        </View>
        <View
          style={{
            backgroundColor: 'white',
            marginTop: 4,
            width: '95%',
            padding: 10,
            borderRadius: 10,
            flexDirection: 'column',
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <Text style={{marginRight: '65%', fontSize: 20, color: '#8D8D8D'}}>
              Mô tả shop
            </Text>
            <Text>{description.length}/500</Text>
          </View>
          <TextInput
            placeholder="Nhập mô tả"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={4}
            maxLength={500}
            style={{
              height: 100,
              textAlignVertical: 'top',
              textAlign: 'left',
              borderColor: 'gray',
              borderWidth: 1,
              fontSize: 20,
            }}
          />
        </View>
        <View style={styles.box}>
          <Text style={{fontSize: 20, color: '#8D8D8D', width: '30%'}}>
            Số điện thoại
          </Text>
          <TextInput
            placeholder="Nhập số điện thoại"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            style={{width: '70%', textAlign: 'right', fontSize: 20}}
          />
        </View>
        <View style={styles.box}>
          <Text style={{fontSize: 20, color: '#8D8D8D', width: '30%'}}>
            Email
          </Text>
          <TextInput
            placeholder="Nhập email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={{width: '70%', textAlign: 'right', fontSize: 20}}
          />
        </View>
      </View>
      {/* Modal hiển thị khi bấm nút logo shop */}
      <Modal
        visible={showLogoModal}
        transparent
        animationType="fade"
        onRequestClose={closeLogoModal}>
        <TouchableOpacity style={styles.modalOverlay} onPress={closeLogoModal}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalOption} onPress={openCamera}>
              <Text style={styles.modalOptionText}>Chụp ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={openLibrary}>
              <Text style={styles.modalOptionText}>Chọn sẵn có</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={closeLogoModal}>
              <Text style={[styles.modalOptionText, {color: 'red'}]}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default EditShop;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
  },
  back: {
    marginTop: 8,
  },
  headertext: {
    fontSize: 30,
  },
  box: {
    backgroundColor: 'white',
    marginTop: 4,
    width: '95%',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 10,
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
