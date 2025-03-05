import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Keyboard,
} from 'react-native';
import React, {useState} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const EditShop = ({navigation}) => {
  const [shopName, setShopName] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Quản lý trạng thái hiển thị Modal
  const [showLogoModal, setShowLogoModal] = useState(false);
  // Quản lý ảnh/logo đã chọn (nếu có)
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Mở Modal
  const openLogoModal = () => {
    Keyboard.dismiss(); // ẩn bàn phím nếu đang mở
    setShowLogoModal(true);
  };
  // Đóng Modal
  const closeLogoModal = () => {
    setShowLogoModal(false);
  };

  // Hàm mở camera
  const openCamera = () => {
    const options = {
      mediaType: 'photo', // chỉ chụp ảnh
      quality: 1,
    };
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const media = response.assets[0];
        console.log('Media from camera: ', media);
        setSelectedMedia(media);
      }
      closeLogoModal();
    });
  };

  // Hàm mở thư viện ảnh
  const openLibrary = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const media = response.assets[0];
        console.log('Media from library: ', media);
        setSelectedMedia(media);
      }
      closeLogoModal();
    });
  };
  const handleSave = () => {
    // Xử lý lưu thông tin shop
    console.log('Shop name:', shopName);
    console.log('Description:', description);
    console.log('Email:', email);
    console.log('Phone:', phoneNumber);
    console.log('Selected Logo:', selectedMedia?.uri);
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
        <TouchableOpacity onPress={handleSave}>
          <Text style={{color: 'red', fontSize: 20, marginTop: 5}}>Lưu</Text>
        </TouchableOpacity>
      </View>
      <View style={{alignItems: 'center'}}>
        <View style={styles.box}>
          {/* Hiển thị ảnh đã chọn nếu có, nếu chưa thì hiển thị icon user.png */}
          <TouchableOpacity onPress={openLogoModal}>
            {selectedMedia ? (
              <Image
                source={{uri: selectedMedia.uri}}
                style={{
                  width: 60,
                  height: 60,
                  marginLeft: 10,
                  borderRadius: 30,
                }}
              />
            ) : (
              <Image
                source={require('../assets/icons/user.png')}
                style={{width: 60, height: 60, marginLeft: 10}}
              />
            )}
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
