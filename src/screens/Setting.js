import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

const SettingScreen = ({navigation}) => {
  const [isToggled, setIsToggled] = useState(false);
  const [isToggledPrice, setIsToggledPrice] = useState(false);

  const handlePress = () => {
    setIsToggled(!isToggled);
  };
  const handlePressPrice = () => {
    setIsToggledPrice(!isToggledPrice);
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
        <Text style={styles.headertext}>Thiết lập Book's Haven</Text>
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.box}
          onPress={() => navigation.navigate('EditShop')}>
          <Text style={styles.txt}>Hồ sơ shop</Text>
          <Image
            source={require('../assets/icons/Vector2.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <View style={styles.box}>
          <Text style={styles.txt}>Chế độ tạm nghỉ</Text>
          <TouchableOpacity onPress={handlePress}>
            <Image
              source={
                isToggled
                  ? require('../assets/icons/on.png')
                  : require('../assets/icons/off.png')
              }
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.box}>
          <Text style={styles.txt}>Cho phép trả giá</Text>
          <TouchableOpacity onPress={handlePressPrice}>
            <Image
              source={
                isToggledPrice
                  ? require('../assets/icons/on.png')
                  : require('../assets/icons/off.png')
              }
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.box}
          onPress={() => navigation.navigate('SettingShip')}>
          <Text style={styles.txt}>Lựa chọn vận chuyển</Text>
          <Image
            source={require('../assets/icons/Vector2.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.box}>
          <Text style={styles.txt}>Lựa chọn thanh toán</Text>
          <Image
            source={require('../assets/icons/Vector2.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.box}
          onPress={() => navigation.navigate('SettingNotification')}>
          <Text style={styles.txt}>Cài đặt thông báo</Text>
          <Image
            source={require('../assets/icons/Vector2.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.box}>
          <Text style={styles.txt}>Cài đặt chat</Text>
          <Image
            source={require('../assets/icons/Vector2.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.box}
          onPress={() => navigation.navigate('SettingAccount')}>
          <Text style={styles.txt}>Thiết lập tài khoản</Text>
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
      </View>
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
    alignItems: 'center',
  },
  txt: {
    fontSize: 18,
  },
  icon: {
    marginTop: 3,
  },
});

export default SettingScreen;
