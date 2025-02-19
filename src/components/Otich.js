import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

const Otich = ({onCheckChange}) => {
    const [checked, setChecked] = useState(false)
    const toggleCheckbox=()=>{
        const newChecked=!checked
        setChecked(newChecked)
        if(onCheckChange){
            onCheckChange(newChecked)
        }
    }
  return (
    <TouchableOpacity onPress={toggleCheckbox} style={styles.checkboxContainer}>
        <View style={[styles.checkbox, checked && styles.checked]}>
        {checked && <Image style={{height:24,width:24}} source={require('../assets/dautich2.png')}/>}
        </View>
    </TouchableOpacity>
  )
}

export default Otich

const styles = StyleSheet.create({
    checkboxContainer: {
     marginRight:20,
        alignItems: 'center',
        
      },
      checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderRadius: 5,
      },
      checked: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
      },
      label: {
        fontSize: 16,
      },
})