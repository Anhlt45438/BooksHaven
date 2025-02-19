import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const RegisShop2 = ({navigation}) => {
  const [shopName, setShopName] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <Text style={styles.headertext}>Thông tin shop</Text>
      </View>

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: '#F1EFF1',
          justifyContent: 'space-between',
        }}>
        <View style={styles.box1}>
          <View style={{alignItems: 'center', padding: 20}}>
            <Text style={{marginBottom: 15}}>
              Vui lòng cung cấp thông tin để lập tài khoản
            </Text>
            <Text style={{marginBottom: 15}}>người bán trên Book's Haven</Text>
            <View style={{flexDirection: 'row'}}>
              <View>
                <Image source={require('../assets/image/Ellipse1.png')} />
              </View>

              <View
                style={{
                  height: 0.3,
                  width: 150,
                  backgroundColor: 'gray',
                  marginTop: 10,
                }}></View>
              <View>
                <Image source={require('../assets/image/Ellipse2.png')} />
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: 'red', marginRight: 60}}>
                Thông tin shop
              </Text>
              <Text>cài đặt vận chuyển</Text>
            </View>
          </View>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Tên shop"
              value={shopName}
              onChangeText={setShopName}
            />
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ lấy hàng"
              value={location}
              onChangeText={setLocation}
            />
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
        </View>
        <View style={styles.box2}>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: '#D9D9D9'}]}
            onPress={() => navigation.goBack()}>
            <Text style={[styles.buttontext, {color: 'black'}]}>Quay lại</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('RegisShop3')}>
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
  box1: {
    width: '90%',
    height: 360,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'flex-start',
    margin: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.1,
    marginBottom: 10,
    width: '80%',
    paddingLeft: 10,
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
});

export default RegisShop2;
