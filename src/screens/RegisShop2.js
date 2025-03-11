import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import {locations} from '../location/Locations';
import {useAppDispatch} from '../store'; // Sử dụng hook dispatch từ Redux
import {registerShop} from '../redux/shopSlice'; // Import async thunk registerShop

const RegisShop2 = ({navigation, route}) => {
  const {user} = route.params;
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.sđt);
  const [addressDetail, setAddressDetail] = useState('');
  console.log('email,sddt: ', user.email, user.sđt);

  // Trạng thái hiển thị modal
  const [isProvinceModalVisible, setIsProvinceModalVisible] = useState(false);
  const [isDistrictModalVisible, setIsDistrictModalVisible] = useState(false);
  const [isWardModalVisible, setIsWardModalVisible] = useState(false);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  const getDistricts = () =>
    selectedProvince
      ? locations.find(loc => loc.name === selectedProvince)?.districts
      : [];
  const getWards = () =>
    selectedDistrict
      ? locations
          .find(loc => loc.name === selectedProvince)
          .districts.find(dist => dist.name === selectedDistrict)?.wards
      : [];

  // Kiểm tra số điện thoại hợp lệ
  const validatePhoneNumber = phone => {
    const phoneRegex = /^[0-9]{10,11}$/; // Kiểm tra số điện thoại có 10-11 chữ số
    return phoneRegex.test(phone);
  };

  const handleRegisterShop = async () => {
    if (
      !shopName ||
      !email ||
      !phoneNumber ||
      !addressDetail ||
      !province ||
      !district ||
      !ward
    ) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const shopData = {
      ten_shop,
      email,
      phoneNumber,
      addressDetail,
      province,
      district,
      ward,
      mo_ta,
    };

    try {
      await dispatch(registerShop(shopData)); // Gọi async thunk để đăng ký shop
      Alert.alert('Thông báo', 'Đăng ký shop thành công!');
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const renderModal = (type, data) => (
    <Modal
      visible={
        type === 'province'
          ? isProvinceModalVisible
          : type === 'district'
          ? isDistrictModalVisible
          : isWardModalVisible
      }
      transparent={true}
      animationType="fade">
      <View style={styles.modalContainer}>
        <FlatList
          data={data}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => {
                if (type === 'province') {
                  setSelectedProvince(item.name);
                  setSelectedDistrict('');
                  setSelectedWard('');
                } else if (type === 'district') {
                  setSelectedDistrict(item.name);
                  setSelectedWard('');
                } else {
                  setSelectedWard(item.name);
                }
                closeModal(type);
              }}>
              <Text style={styles.modalItemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          style={styles.modalCloseButton}
          onPress={() => closeModal(type)}>
          <Text style={styles.modalCloseText}>Đóng</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  const closeModal = type => {
    if (type === 'province') {
      setIsProvinceModalVisible(false);
    } else if (type === 'district') {
      setIsDistrictModalVisible(false);
    } else {
      setIsWardModalVisible(false);
    }
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
            <View style={styles.imageRow}>
              <Image source={require('../assets/image/Ellipse1.png')} />
              <View style={styles.divider}></View>
              <Image source={require('../assets/image/Ellipse2.png')} />
            </View>
            <View style={styles.subHeader}>
              <Text style={styles.subHeaderText}>Thông tin shop</Text>
              <Text style={styles.subHeaderText}>cài đặt vận chuyển</Text>
            </View>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Tên shop"
            value={shopName}
            onChangeText={setShopName}
          />

          {/* Tỉnh, Huyện, Phường modal buttons */}
          <View style={styles.content}>
            <TouchableOpacity
              style={styles.button1}
              onPress={() => setIsProvinceModalVisible(true)}>
              <Text style={styles.buttonText}>
                {selectedProvince ? selectedProvince : 'Chọn Tỉnh'}
              </Text>
            </TouchableOpacity>

            {selectedProvince && (
              <TouchableOpacity
                style={styles.button1}
                onPress={() => setIsDistrictModalVisible(true)}>
                <Text style={styles.buttonText}>
                  {selectedDistrict ? selectedDistrict : 'Chọn Huyện'}
                </Text>
              </TouchableOpacity>
            )}

            {selectedDistrict && (
              <TouchableOpacity
                style={styles.button1}
                onPress={() => setIsWardModalVisible(true)}>
                <Text style={styles.buttonText}>
                  {selectedWard ? selectedWard : 'Chọn Phường/Xã'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Địa chỉ chi tiết */}
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.textInput}
              placeholder="Địa chỉ chi tiết (số nhà, tên đường...) "
              value={addressDetail}
              onChangeText={setAddressDetail}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
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

      {/* Modals */}
      {renderModal('province', locations)}
      {renderModal('district', getDistricts())}
      {renderModal('ward', getWards())}
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 5,
    width: 400,
    alignItems: 'center',
    borderRadius: 20,
  },
  modalItemText: {
    fontSize: 16,
  },
  modalCloseButton: {
    backgroundColor: '#FF4500',
    padding: 10,
    borderRadius: 5,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default RegisShop2;
