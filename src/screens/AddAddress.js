import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const AddAddress = ({navigation}) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  // State lưu thông báo lỗi cho từng trường
  const [errors, setErrors] = useState({
    fullName: '',
    phoneNumber: '',
    province: '',
    district: '',
    ward: '',
    addressDetail: '',
  });

  const validate = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Họ và Tên không được để trống';
    if (!phoneNumber.trim())
      newErrors.phoneNumber = 'Số điện thoại không được để trống';
    if (!province.trim())
      newErrors.province = 'Tỉnh/Thành phố không được để trống';
    if (!district.trim()) newErrors.district = 'Quận/Huyện không được để trống';
    if (!ward.trim()) newErrors.ward = 'Phường/Xã không được để trống';
    if (!addressDetail.trim())
      newErrors.addressDetail = 'Địa chỉ chi tiết không được để trống';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      // Nếu có lỗi, không gửi tin nhắn, lỗi sẽ hiển thị ngay dưới các ô input.
      return;
    }
    const newAddress = {
      fullName,
      phoneNumber,
      province,
      district,
      ward,
      addressDetail,
      isDefault,
    };
    console.log('Địa chỉ mới:', newAddress);
    navigation.goBack();
  };

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

      {/* Nội dung */}
      <ScrollView style={styles.content}>
        {/* Họ và Tên */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Họ và Tên</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Nhập họ và tên"
            value={fullName}
            onChangeText={text => {
              setFullName(text);
              setErrors({...errors, fullName: ''});
            }}
          />
          {errors.fullName ? (
            <Text style={styles.errorText}>{errors.fullName}</Text>
          ) : null}
        </View>

        {/* Số điện thoại */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={text => {
              setPhoneNumber(text);
              setErrors({...errors, phoneNumber: ''});
            }}
          />
          {errors.phoneNumber ? (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          ) : null}
        </View>

        {/* Tỉnh/Thành phố */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tỉnh/Thành phố</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Chọn Tỉnh/Thành phố"
            value={province}
            onChangeText={text => {
              setProvince(text);
              setErrors({...errors, province: ''});
            }}
          />
          {errors.province ? (
            <Text style={styles.errorText}>{errors.province}</Text>
          ) : null}
        </View>

        {/* Quận/Huyện */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quận/Huyện</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Chọn Quận/Huyện"
            value={district}
            onChangeText={text => {
              setDistrict(text);
              setErrors({...errors, district: ''});
            }}
          />
          {errors.district ? (
            <Text style={styles.errorText}>{errors.district}</Text>
          ) : null}
        </View>

        {/* Phường/Xã */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phường/Xã</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Chọn Phường/Xã"
            value={ward}
            onChangeText={text => {
              setWard(text);
              setErrors({...errors, ward: ''});
            }}
          />
          {errors.ward ? (
            <Text style={styles.errorText}>{errors.ward}</Text>
          ) : null}
        </View>

        {/* Địa chỉ chi tiết */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Địa chỉ chi tiết</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Nhập số nhà, tên đường..."
            value={addressDetail}
            onChangeText={text => {
              setAddressDetail(text);
              setErrors({...errors, addressDetail: ''});
            }}
          />
          {errors.addressDetail ? (
            <Text style={styles.errorText}>{errors.addressDetail}</Text>
          ) : null}
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

      {/* Nút Lưu */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Hoàn thành</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddAddress;

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
});
