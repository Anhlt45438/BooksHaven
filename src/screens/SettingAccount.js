import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView, Alert,
} from 'react-native';
import {logoutUserThunk} from "../redux/userSlice";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingAccount = ({navigation}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  const handleLogout = async () => {
    try {
      // Lấy accessToken từ AsyncStorage
      const accessToken = await AsyncStorage.getItem('accessToken');
      console.log('accessToken từ AsyncStorage trong handleLogout:', accessToken);

      if (accessToken) {
        const resultAction = await dispatch(logoutUserThunk(accessToken));
        if (logoutUserThunk.fulfilled.match(resultAction)) {
          await AsyncStorage.removeItem('accessToken'); // Xóa token
          Alert.alert('Thành công', 'Đăng xuất thành công!');
          navigation.navigate('Login');
        } else {
          Alert.alert('Lỗi', 'Đăng xuất không thành công. Vui lòng thử lại!');
          console.error('Lỗi khi gọi logoutUserThunk:', resultAction.payload);
        }
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy token để đăng xuất.');
      }
    } catch (error) {
      console.error('Lỗi khi xử lý đăng xuất:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đăng xuất.');
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
        <Text style={styles.headertext}>Thiết lập tài khoản</Text>
      </View>
      <ScrollView style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              width: '95%',
              marginTop: 5,
              color: '#8D8D8D',
              fontSize: 16,
            }}>
            Tài khoản
          </Text>
          <TouchableOpacity
            style={styles.box}
            onPress={() => navigation.navigate('EditShop')}>
            <Text style={styles.txt}>Tài khoản và mật khẩu</Text>
            <Image
              source={require('../assets/icons/Vector2.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.box}>
            <Text style={styles.txt}>Địa chỉ</Text>
            <Image
              source={require('../assets/icons/Vector2.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.box}
            onPress={() => navigation.navigate('SettingShip')}>
            <Text style={styles.txt}>Tài khoản & Ngân hàng</Text>
            <Image
              source={require('../assets/icons/Vector2.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text
            style={{
              width: '95%',
              marginTop: 5,
              color: '#8D8D8D',
              fontSize: 16,
            }}>
            Cài đặt
          </Text>
          <TouchableOpacity style={styles.box}>
            <Text style={styles.txt}>Cài đặt chat</Text>
            <Image
              source={require('../assets/icons/Vector2.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.box}>
            <Text style={styles.txt}>Cài đặt thông báo</Text>
            <Image
              source={require('../assets/icons/Vector2.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.box}>
            <Text style={styles.txt}>Cài đặt riêng tư</Text>
            <Image
              source={require('../assets/icons/Vector2.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.box}>
            <Text style={styles.txt}>Người dùng bị chặn</Text>
            <Image
              source={require('../assets/icons/Vector2.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.box}>
            <Text style={styles.txt}>Ngôn ngữ</Text>
            <Image
              source={require('../assets/icons/Vector2.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text
            style={{
              width: '95%',
              marginTop: 5,
              color: '#8D8D8D',
              fontSize: 16,
            }}>
            Hỗ trợ
          </Text>
          <TouchableOpacity style={styles.box}>
            <Text style={styles.txt}>Trung tâm hỗ trợ</Text>
            <Image
              source={require('../assets/icons/Vector2.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.box}>
            <Text style={styles.txt}>Tiêu chuẩn cộng đồng</Text>
            <Image
              source={require('../assets/icons/Vector2.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.box}>
            <Text style={styles.txt}>Điều khoản Book's haven</Text>
            <Image
              source={require('../assets/icons/Vector2.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.box}>
            <Text style={styles.txt}>Giới thiệu</Text>
            <Image
              source={require('../assets/icons/Vector2.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.box}>
            <Text style={styles.txt}>Yêu cầu huỷ tài khoản</Text>
            <Image
              source={require('../assets/icons/Vector2.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '95%',
              backgroundColor: '#FF5900',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              height: 40,
              marginTop: 10,
            }} onPress={handleLogout}>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View
        style={{height: 2, backgroundColor: 'rgba(200, 200, 200, 1)'}}></View>
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
  },
  back: {
    marginEnd: 30,
    marginTop: 4,
  },
  headertext: {
    marginLeft: '15%',
    fontSize: 20,
  },
  button: {
    width: 400,
    height: 40,
    backgroundColor: '#00B822',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttontext: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  box: {
    width: '95%',
    backgroundColor: 'white',
    marginTop: 5,
    borderRadius: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 10,
  },
  container: {
    flex: 1,
  },
  txt: {
    fontSize: 18,
  },
  icon: {
    marginTop: 3,
  },
});

export default SettingAccount;
