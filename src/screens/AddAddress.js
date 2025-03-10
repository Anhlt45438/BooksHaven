import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  TextInput,
} from 'react-native';
import {locations} from '../location/Locations';

const AddAddress = ({navigation, route}) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [errors, setErrors] = useState({
    fullName: '',
    phoneNumber: '',
    addressDetail: '',
  });

  const validate = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Họ và Tên không được để trống';
    if (!phoneNumber.trim())
      newErrors.phoneNumber = 'Số điện thoại không được để trống';
    if (!selectedProvince)
      newErrors.province = 'Tỉnh/Thành phố không được để trống';
    if (!selectedDistrict)
      newErrors.district = 'Quận/Huyện không được để trống';
    if (!selectedWard) newErrors.ward = 'Phường/Xã không được để trống';
    if (!addressDetail.trim())
      newErrors.addressDetail = 'Địa chỉ chi tiết không được để trống';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Modal visibility states
  const [isProvinceModalVisible, setIsProvinceModalVisible] = useState(false);
  const [isDistrictModalVisible, setIsDistrictModalVisible] = useState(false);
  const [isWardModalVisible, setIsWardModalVisible] = useState(false);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  // Trong màn hình AddAddress.js
  useEffect(() => {
    if (route.params?.addressToEdit) {
      const {addressToEdit} = route.params;
      setFullName(addressToEdit.name);
      setPhoneNumber(addressToEdit.phone);
      setAddressDetail(addressToEdit.address);
      setSelectedProvince(addressToEdit.province);
      setSelectedDistrict(addressToEdit.district);
      setSelectedWard(addressToEdit.ward);
      setIsDefault(addressToEdit.default);
    }
  }, [route.params?.addressToEdit]);

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    const newAddress = {
      id: route.params?.addressToEdit?.id || new Date().getTime().toString(), // Nếu sửa thì giữ id cũ, nếu thêm mới thì tạo id mới
      name: fullName,
      phone: phoneNumber,
      address: `${selectedProvince}, ${selectedDistrict}, ${selectedWard}, ${addressDetail}`,
      default: isDefault,
    };

    // Nếu là sửa địa chỉ, truyền lại dữ liệu đã sửa
    if (route.params?.addressToEdit) {
      navigation.navigate('ChanceAddress', {updatedAddress: newAddress}); // Sửa xong, truyền updatedAddress
    } else {
      // Nếu là thêm địa chỉ mới, thêm vào danh sách
      navigation.navigate('ChanceAddress', {newAddress});
    }
  };
  // Render Modal cho các lựa chọn tỉnh, huyện, xã
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

  // Đóng Modal
  const closeModal = type => {
    if (type === 'province') {
      setIsProvinceModalVisible(false);
    } else if (type === 'district') {
      setIsDistrictModalVisible(false);
    } else {
      setIsWardModalVisible(false);
    }
  };

  // Lấy thông tin huyện từ tỉnh đã chọn
  const getDistricts = () =>
    selectedProvince
      ? locations.find(loc => loc.name === selectedProvince)?.districts
      : [];

  // Lấy thông tin xã từ huyện đã chọn
  const getWards = () =>
    selectedDistrict
      ? locations
          .find(loc => loc.name === selectedProvince)
          .districts.find(dist => dist.name === selectedDistrict)?.wards
      : [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backText}>Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm địa chỉ mới</Text>
        <View style={{width: 60}} />
      </View>

      <ScrollView style={styles.content}>
        {/* Họ và Tên */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Họ và Tên</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Nhập họ và tên"
            value={fullName}
            onChangeText={setFullName}
          />
          {errors.fullName && (
            <Text style={styles.errorText}>{errors.fullName}</Text>
          )}
        </View>

        {/* Số điện thoại */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          {errors.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          )}
        </View>

        {/* Nút bấm để chọn Tỉnh, Huyện, Phường/Xã */}
        <View style={styles.content}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsProvinceModalVisible(true)}>
            <Text style={styles.buttonText}>
              {selectedProvince ? selectedProvince : 'Chọn Tỉnh'}
            </Text>
          </TouchableOpacity>

          {selectedProvince && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsDistrictModalVisible(true)}>
              <Text style={styles.buttonText}>
                {selectedDistrict ? selectedDistrict : 'Chọn Huyện'}
              </Text>
            </TouchableOpacity>
          )}

          {selectedDistrict && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsWardModalVisible(true)}>
              <Text style={styles.buttonText}>
                {selectedWard ? selectedWard : 'Chọn Phường/Xã'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Địa chỉ chi tiết */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Địa chỉ chi tiết</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Nhập số nhà, tên đường..."
            value={addressDetail}
            onChangeText={setAddressDetail}
          />
          {errors.addressDetail && (
            <Text style={styles.errorText}>{errors.addressDetail}</Text>
          )}
        </View>

        {/* Đặt làm địa chỉ mặc định */}
        <TouchableOpacity
          style={styles.defaultRow}
          onPress={() => setIsDefault(!isDefault)}>
          <View style={styles.checkBox}>
            {isDefault && <View style={styles.checkBoxInner} />}
          </View>
          <Text style={styles.defaultText}>Đặt làm địa chỉ mặc định</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Hoàn thành</Text>
      </TouchableOpacity>

      {/* Modals */}
      {renderModal('province', locations)}
      {renderModal('district', getDistricts())}
      {renderModal('ward', getWards())}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  backButton: {
    width: 60,
  },
  backText: {
    color: '#007AFF',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 15,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: '95%',
    marginVertical: 5,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: 'red',
  },
  defaultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  checkBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBoxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#007AFF',
  },
  defaultText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#FF4500',
    margin: 15,
    borderRadius: 5,
    alignItems: 'center',
    paddingVertical: 14,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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

export default AddAddress;
