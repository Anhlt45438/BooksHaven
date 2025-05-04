import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const ModalThongBao = ({visible, message, onOkPress}) => {
  return (
    <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onOkPress}
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        
        
        <Text style={styles.modalText}>{message}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={onOkPress}
        >
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
  )
}

export default ModalThongBao

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 16,
    },
    button: {
      backgroundColor: '#08B05C',
      borderRadius: 5,
      padding: 10,
      elevation: 2,
      minWidth: 100,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 16,
    },
  });