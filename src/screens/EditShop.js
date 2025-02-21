import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';

const EditShop = ({navigation}) => {
  const [shopName, setShopName] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
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
        <TouchableOpacity onPress={() => {}}>
          <Text style={{color: 'red', fontSize: 20, marginTop: 5}}>Lưu</Text>
        </TouchableOpacity>
      </View>
      <View style={{alignItems: 'center'}}>
        <View style={[styles.box, {}]}>
          <TouchableOpacity onPress={() => {}}>
            <Image
              source={require('../assets/icons/user.png')}
              style={{width: 60, height: 60, marginLeft: 10}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
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
});
