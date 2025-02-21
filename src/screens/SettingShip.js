import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

const SettingShip = ({navigation}) => {
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
        <Text style={styles.headertext}>Cài đặt vận chuyển</Text>
      </View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.box} onPress={() => {}}>
          <View style={{width: '70%'}}>
            <Text style={styles.txt}>Địa chỉ</Text>
            <Text style={styles.txt1}>Quản lý địa chỉ giao hàng của bạn</Text>
          </View>
          <Image
            source={require('../assets/icons/Vector2.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.box}>
          <View style={{width: '70%'}}>
            <Text style={styles.txt}>Phương thức vận chuyển</Text>
            <Text style={styles.txt1}>
              tuỳ chọn kích hoạt phương thức vận chuyển bạn muốn
            </Text>
          </View>
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
    marginLeft: '20%',
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  txt1: {
    color: '#8D8D8D',
  },
  icon: {
    marginTop: 20,
  },
});

export default SettingShip;
