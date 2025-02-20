import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const RegisShop3 = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <Text style={styles.headertext}>Cài đặt vận chuyển</Text>
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
            <View style={{flexDirection: 'row'}}>
              <View>
                <Image source={require('../assets/image/Ellipse2.png')} />
              </View>

              <View
                style={{
                  height: 0.3,
                  width: 150,
                  backgroundColor: 'gray',
                  marginTop: 10,
                }}></View>
              <View>
                <Image source={require('../assets/image/Ellipse1.png')} />
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{marginRight: 60}}>Thông tin shop</Text>
              <Text style={{color: 'red'}}>cài đặt vận chuyển</Text>
            </View>
          </View>
          <View>
            <Text>Cài đặt vận chuyển</Text>
            <Text>vui lòng kích hoạt ít nhất 1 phương thức vận chuyển!</Text>
            <View>
              <View>
                <Image source={require('../assets/image/Ellipse1.png')} />
              </View>
              <View></View>
            </View>
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
            onPress={() => navigation.navigate('MyShop')}>
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

export default RegisShop3;
