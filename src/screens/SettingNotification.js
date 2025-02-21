import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

const SettingNotification = ({navigation}) => {
  const [isToggled, setIsToggled] = useState(false);
  const [isToggledAPP, setIsToggledAPP] = useState(false);
  const [isToggledEmail, setIsToggledEmail] = useState(false);
  const [isToggledSMS, setIsToggledSMS] = useState(false);
  const [isToggledZalo, setIsToggledZalo] = useState(false);

  const handlePress = () => {
    setIsToggled(!isToggled);
  };
  const handlePressAPP = () => {
    setIsToggledAPP(!isToggledAPP);
  };
  const handlePressEmail = () => {
    setIsToggledEmail(!isToggledEmail);
  };
  const handlePressSMS = () => {
    setIsToggledSMS(!isToggledSMS);
  };
  const handlePressZalo = () => {
    setIsToggledZalo(!isToggledZalo);
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
        <Text style={styles.headertext}>Cài đặt thông báo</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.txt}>Thông báo</Text>
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
          <Text style={styles.txt}>Thông báo trong ứng dụng</Text>
          <TouchableOpacity onPress={handlePressAPP}>
            <Image
              source={
                isToggledAPP
                  ? require('../assets/icons/on.png')
                  : require('../assets/icons/off.png')
              }
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.box}>
          <Text style={styles.txt}>Thông báo Email</Text>
          <TouchableOpacity onPress={handlePressEmail}>
            <Image
              source={
                isToggledEmail
                  ? require('../assets/icons/on.png')
                  : require('../assets/icons/off.png')
              }
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.box}>
          <Text style={styles.txt}>Thông báo SMS</Text>
          <TouchableOpacity onPress={handlePressSMS}>
            <Image
              source={
                isToggledSMS
                  ? require('../assets/icons/on.png')
                  : require('../assets/icons/off.png')
              }
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.box}>
          <Text style={styles.txt}>Thông báo Zalo</Text>
          <TouchableOpacity onPress={handlePressZalo}>
            <Image
              source={
                isToggledZalo
                  ? require('../assets/icons/on.png')
                  : require('../assets/icons/off.png')
              }
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
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
    marginTop: 10,
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

export default SettingNotification;
