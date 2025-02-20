import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const MyShop = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <Text style={styles.headertext}>Shop của tôi</Text>
        <View style={{flexDirection: 'row'}}>
          <Image source={require('../assets/icons/settings.png')} />
          <Image source={require('../assets/icons/bell.png')} />
          <Image source={require('../assets/icons/Vector1.png')} />
        </View>
      </View>

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: '#F1EFF1',
          justifyContent: 'space-between',
        }}>
        <View style={styles.box1}></View>
        <View style={styles.box2}></View>
        <View style={styles.box3}></View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
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

export default MyShop;
